import Steganography
import sys
import argparse
import os

image_steg = Steganography.ImageSteganography()


def hide_pixel(path, message, index, output_image):
    image_steg.hide_in_pixel(path, message, index, output_image)


def extract_info_from_lsb(path):
    return image_steg.extract_info_from_lsb(path)


def embed(cover_file, secret_file, color_plane, pixel_bit):
    image_steg.embed(cover_file, secret_file, color_plane, pixel_bit)


def extract_embedded_image(stego_file, color_plane, pixel_bit, output_image):
    image_steg.extract_embedded_image(
        stego_file, color_plane, pixel_bit, output_image)


def error():
    print "This functionality has not been implemented yet"

parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("function",
                    nargs="?",
                    choices=['lsbhide', 'extractlsb',
                             'embed', 'extractembedded']
                    )
args, sub_args = parser.parse_known_args()

function = error if args.function is None else args.function

parser = argparse.ArgumentParser(prog="%s %s" % (
    os.path.basename(sys.argv[0]), function))

if args.function == "lsbhide":
    parser.add_argument('-m', '--message')
    parser.add_argument('-I', '--index', type=int)
    parser.add_argument('-i', '--input')
    parser.add_argument('-o', '--output')
    args = parser.parse_args(sub_args)
    hide_pixel(args.input, args.message, args.index, args.output)
    print 'SUCCESS'

elif args.function == "extractlsb":
    parser.add_argument('-i', '--input')
    args = parser.parse_args(sub_args)
    # Output to be redirected
    extract_info_from_lsb(args.input)
    print 'SUCCESS'

elif args.function == "embed":
    parser.add_argument('-m', '--message')
    parser.add_argument('-I', '--index', type=int)
    parser.add_argument('-i', '--input')
    parser.add_argument('-p', '--plane', type=int)
    args = parser.parse_args(sub_args)
    embed(args.input[1:], args.message[1:], int(args.plane), int(args.index))
    print 'SUCCESS'

elif args.function == "extractembedded":
    parser.add_argument('-p', '--plane', type=int)
    parser.add_argument('-I', '--index', type=int)
    parser.add_argument('-i', '--input')
    parser.add_argument('-o', '--output')
    args = parser.parse_args(sub_args)
    extract_embedded_image(args.input, args.plane, args.index, args.output)
    print 'SUCCESS'
