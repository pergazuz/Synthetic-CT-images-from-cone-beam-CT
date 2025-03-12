import time
import torch
import wandb

from options.train_options import TrainOptions
from data import create_dataset
from models import create_model
from util.visualizer import Visualizer


if __name__ == '__main__':
    opt = TrainOptions().parse()   # get training options
    dataset = create_dataset(opt)  # create a dataset given opt.dataset_mode and other options
    dataset_size = len(dataset)    # get the number of images in the dataset.

    model = create_model(opt)      # create a model given opt.model and other options
    print('The number of training images = %d' % dataset_size)

    visualizer = Visualizer(opt)   # create a visualizer that display/save images and plots
    total_iters = 0                # the total number of training iterations

    optimize_time = 0.1

    # 2. Initialize wandb run
    # You can pass hyperparameters (opt) into wandb.config or directly in wandb.init(...).
    wandb.init(
        project="senior_project",
        name=opt.name,                # for clarity, you could use the same name as your experiment
        config=vars(opt)             # store all experiment opts in wandb config
    )

    # Log static info once (e.g. dataset size)
    wandb.config.update({'dataset_size': dataset_size})

    for epoch in range(opt.epoch_count, opt.n_epochs + opt.n_epochs_decay + 1):
        epoch_start_time = time.time()
        iter_data_time = time.time()
        epoch_iter = 0
        visualizer.reset() 

        dataset.set_epoch(epoch)
        for i, data in enumerate(dataset):
            iter_start_time = time.time()
            if total_iters % opt.print_freq == 0:
                t_data = iter_start_time - iter_data_time

            batch_size = data["A"].size(0)
            total_iters += batch_size
            epoch_iter += batch_size

            if len(opt.gpu_ids) > 0:
                torch.cuda.synchronize()

            optimize_start_time = time.time()
            if epoch == opt.epoch_count and i == 0:
                model.data_dependent_initialize(data)
                model.setup(opt)     
                model.parallelize()

            model.set_input(data)  
            model.optimize_parameters()
            if len(opt.gpu_ids) > 0:
                torch.cuda.synchronize()

            optimize_time = (time.time() - optimize_start_time) / batch_size * 0.005 + 0.995 * optimize_time

            # -----------------------------------------------------------
            # (Optional) Visualizer / logging code
            # -----------------------------------------------------------
            # (a) Display images & save HTML results (existing code)
            if total_iters % opt.display_freq == 0:
                save_result = total_iters % opt.update_html_freq == 0
                model.compute_visuals()
                visualizer.display_current_results(model.get_current_visuals(), epoch, save_result)

            # (b) Print & log training losses
            if total_iters % opt.print_freq == 0:
                losses = model.get_current_losses()
                visualizer.print_current_losses(epoch, epoch_iter, losses, optimize_time, t_data)
                
                # 3. Log losses to wandb
                # Here you can log each loss individually:
                # losses is typically a dictionary, e.g. {"G_GAN": val, "G_L1": val, ...}
                wandb.log({
                    **losses,                 # spread the dictionary of losses
                    "epoch": epoch,
                    "epoch_iter": epoch_iter,
                    "optimize_time": optimize_time,
                    "data_time": t_data
                }, step=total_iters)

                # If you want a single scalar for total loss, you could do:
                # wandb.log({"total_loss": sum(losses.values())}, step=total_iters)

                if opt.display_id is None or opt.display_id > 0:
                    visualizer.plot_current_losses(epoch, float(epoch_iter) / dataset_size, losses)

            # (c) Save model periodically
            if total_iters % opt.save_latest_freq == 0:
                print('saving the latest model (epoch %d, total_iters %d)' % (epoch, total_iters))
                print(opt.name)
                save_suffix = 'iter_%d' % total_iters if opt.save_by_iter else 'latest'
                model.save_networks(save_suffix)
                
            iter_data_time = time.time()

        if epoch % opt.save_epoch_freq == 0:
            print('saving the model at the end of epoch %d, iters %d' % (epoch, total_iters))
            model.save_networks('latest')
            model.save_networks(epoch)

        print('End of epoch %d / %d \t Time Taken: %d sec' %
              (epoch, opt.n_epochs + opt.n_epochs_decay, time.time() - epoch_start_time))
        model.update_learning_rate()
