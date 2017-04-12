import binascii
import numpy as np
from PIL import Image
from encryption import AESCipher
import sys


class ImageSteganography:

    def image_to_matrix(self, path):
        image = Image.open(path)
        matrix = np.array(image)
        return matrix

    def matrix_to_image(self, matrix, output_image):
        image = Image.fromarray(matrix)
        image.save(output_image)
        return image

    def text_to_bits(self, message):
        result = []
        for c in message:
            bits = bin(ord(c))[2:]
            bits = '00000000'[len(bits):] + bits
            result.extend([int(b) for b in bits])
        return result

    def text_from_bits(self, bits):
        # matrix with 8 elements per row (1 byte)
        bits = np.reshape(bits, (-1, 8))
        bitvalues = [128, 64, 32, 16, 8, 4, 2, 1]
        bytes = np.sum(bits * bitvalues, axis=1)  # rows to bytes
        # convert each byte to a character and put into a list
        chars = [chr(b) for b in bytes]
        return ''.join(chars)

    def set_bit(self, number, index, flag):  # index starts from 0 where 0 is LSB
        # Compute mask, an integer with just bit 'index' set.
        mask = 1 << index
        # Clear the bit indicated by the mask (if flag is False)
        number &= ~mask
        if flag:
            # If flag was True, set the bit indicated by the mask.
            number |= mask
        return number

    def hide_in_pixel(self, path, message, index, plane, output_image):
        matrix = self.image_to_matrix(path)
        bit_message = self.text_to_bits(message)
        flatten_matrix = matrix.reshape(-1, 3)
        inverted_plane = []
        operational_list = flatten_matrix[:, plane].flatten()
        result_matrix = np.ones((flatten_matrix.shape[0], 1))
        operational_list_index = (operational_list & (
            1 << index)) >> index  # Get index bit of a number
        bit_message = np.append(
            bit_message, operational_list_index[len(bit_message):])
        # number ^= (-x ^ number) & (1 << n)
        operational_list_temp = (-bit_message ^
                                 operational_list) & (1 << index)
        # Set n bit of a number to x
        operational_list = operational_list ^ operational_list_temp
        operational_matrix = operational_list.reshape(-1, len(plane))
        temp_index = 0
        for plane_index in range(3):
            if plane_index in plane:
                result_matrix = np.column_stack(
                    (result_matrix, np.reshape(operational_matrix[:, temp_index], (-1, 1))))
                temp_index += 1
            else:
                result_matrix = np.column_stack(
                    (result_matrix, np.reshape(flatten_matrix[:, plane_index], (-1, 1))))
        result_matrix = np.reshape(
            result_matrix[:, 1:].flatten(), matrix.shape)
        result_matrix = result_matrix.astype('uint8')
        stegano_image = self.matrix_to_image(result_matrix, output_image)
        return stegano_image

    def extract_info_from_lsb(self, path, plane, index):
        lsb_message_result = []
        matrix = self.image_to_matrix(path)
        flatten_matrix = matrix.reshape(-1, 3)[:, plane].flatten()
        lsb_message_result = (flatten_matrix & (1 << index)) >> index
        lsb_message_result = lsb_message_result.tolist()
        end_index = (len(lsb_message_result) / 8) * 8
        lsb_message_result = self.text_from_bits(
            lsb_message_result[:end_index])
        return lsb_message_result

    def embed(self, cover_file, secret_file, color_plane, pixel_bit):
        cover_array = self.image_to_matrix(cover_file)
        secret_array = self.image_to_matrix(secret_file)
        # every bit except the one at `pixel_bit` position is 1
        mask = 0xff ^ (1 << pixel_bit)
        # shift the MSB of the secret to the `pixel_bit` position
        secret_bits = ((secret_array[..., color_plane] >> 7) << pixel_bit)
        height, width, _ = secret_array.shape
        cover_plane = (cover_array[:height, :width,
                                   color_plane] & mask) + secret_bits
        cover_array[:height, :width, color_plane] = cover_plane
        stego_image = self.matrix_to_image(cover_array, cover_file)
        return stego_image

    def extract_embedded_image(self, stego_file, color_plane, pixel_bit, output_image):
        stego_array = self.image_to_matrix(stego_file)
        change_index = [0, 1, 2]
        change_index.remove(color_plane)
        stego_array[..., change_index] = 0
        stego_array = ((stego_array >> pixel_bit) & 0x01) << 7
        exposed_secret = self.matrix_to_image(stego_array, output_image)
        return exposed_secret
