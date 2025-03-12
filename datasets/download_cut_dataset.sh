#!/bin/bash
# Enable debugging and exit on error.
set -ex

# Check that the user has provided a valid dataset name as the first argument.
FILE=$1

# Validate the provided dataset name against the allowed options.
if [[ $FILE != "ae_photos" && $FILE != "apple2orange" && $FILE != "summer2winter_yosemite" &&  $FILE != "horse2zebra" && $FILE != "monet2photo" && $FILE != "cezanne2photo" && $FILE != "ukiyoe2photo" && $FILE != "vangogh2photo" && $FILE != "maps" && $FILE != "cityscapes" && $FILE != "facades" && $FILE != "iphone2dslr_flower" && $FILE != "mini" && $FILE != "mini_pix2pix" && $FILE != "mini_colorization" && $FILE != "grumpifycat" ]]; then
    echo "Available datasets are: apple2orange, summer2winter_yosemite, horse2zebra, monet2photo, cezanne2photo, ukiyoe2photo, vangogh2photo, maps, cityscapes, facades, iphone2dslr_flower, ae_photos, grumpifycat"
    exit 1
fi

# Special instructions for the 'cityscapes' dataset due to licensing.
if [[ $FILE == "cityscapes" ]]; then
    echo "Due to license issues, we cannot provide the Cityscapes dataset from our repository."
    echo "Please download the Cityscapes dataset from https://cityscapes-dataset.com, and use the script ./datasets/prepare_cityscapes_dataset.py."
    echo "You need to download gtFine_trainvaltest.zip and leftImg8bit_trainvaltest.zip. For further instruction, please read ./datasets/prepare_cityscapes_dataset.py."
    exit 1
fi

echo "Specified dataset: [$FILE]"

# Construct URL and file paths.
URL="https://efrosgans.eecs.berkeley.edu/cyclegan/datasets/$FILE.zip"
ZIP_FILE="./datasets/$FILE.zip"
TARGET_DIR="./datasets/$FILE/"

# Download the dataset using wget.
wget --no-check-certificate -N "$URL" -O "$ZIP_FILE"

# Create the target directory.
mkdir -p "$TARGET_DIR"

# Unzip the downloaded file into the datasets directory.
unzip "$ZIP_FILE" -d "./datasets/"

# Remove the ZIP file after extraction.
rm "$ZIP_FILE"
