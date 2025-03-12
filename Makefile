# Default values that can be overridden on the command line.
DATASET ?= grumpifycat
MODEL   ?= kancut

# Construct parameters.
DATAROOT := ./datasets/$(DATASET)
NAME     := $(DATASET)_$(shell echo $(MODEL) | tr '[:lower:]' '[:upper:]')
CUT_MODE := $(MODEL)

# Declare the 'train' target as phony.
.PHONY: train

# 'train' target: run the training script.
train:
	python train.py --dataroot $(DATAROOT) --name $(NAME) --CUT_mode $(CUT_MODE)
