import binascii
import numpy as np
from PIL import Image
import sys


class Stegano:

    def image_to_matrix(self, path):
        image = Image.open(path)
        matrix = np.array(image)
        return matrix

    def matrix_to_image(self, matrix):
        image = Image.fromarray(matrix)
        image.save('Images/crypto.png')
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

    def hide_in_pixel(self, path, message, index):
        matrix = self.image_to_matrix(path)
        bit_message = self.text_to_bits(message)
        message_size = len(bit_message)
        message_counter = 0
        finish_flag = False

        for row_idx, row in enumerate(matrix):
            for pixel_idx, pixel in enumerate(row):
                for color_idx, color in enumerate(pixel):

                    if(message_counter == message_size):
                        finish_flag = True
                        break
                    stegano_bit = True if bit_message[
                        message_counter] == 1 else False
                    message_counter += 1
                    # Setting LSB to 1 or 0
                    matrix[row_idx][pixel_idx][
                        color_idx] = self.set_bit(color, index, stegano_bit)

                if(finish_flag == True):
                    break
            if(finish_flag == True):
                break

        stegano_image = self.matrix_to_image(matrix)
        return stegano_image

    def extract_info_from_lsb(self, path):
        lsb_message_result = []
        matrix = self.image_to_matrix(path)
        # make sure the data type is integer (redundant)
        matrix = matrix.astype(int)
        lsb_matrix = matrix % 2  # modulo two to get the LSB of each element
        lsb_message_result = lsb_matrix.ravel()  # flatten to a 1D array
        lsb_message_result = lsb_message_result.tolist()
        lsb_message_result = self.text_from_bits(lsb_message_result)
        return lsb_message_result

    def hide_using_bpcs(self, carrier_path, message_path, index, color_index):
        carrier_matrix = self.image_to_matrix(carrier_path)
        message_matrix = self.image_to_matrix(message_path)  # use np.zeros

        for row_index, row in enumerate(message_matrix):
            for pixel_index, pixel in enumerate(row):
                color = message_matrix[row_index][pixel_index][color_index]
                msb = (color & 0xff) >> 7
                carrier_pixel = carrier_matrix[
                    row_index][pixel_index][color_index]
                carrier_matrix[row_index][pixel_index][
                    color_index] = self.set_bit(carrier_pixel, index, msb)

        stegano_image = self.matrix_to_image(carrier_matrix)
        return stegano_image

    def display_bit_plane(self, path, color_index, color_bit):
        message_matrix = self.image_to_matrix(path)
        change_index = [0, 1, 2]
        change_index.remove(color_index)
        message_matrix[:, :, change_index] = 0
        mask = 1 << color_bit
        message_matrix = message_matrix & mask
        message_matrix[message_matrix == 1] = 1 << 7
        stegano_image = self.matrix_to_image(message_matrix)
        return stegano_image

sys.stdout = open('Images/output', 'w')
obj = Stegano()
obj.display_bit_plane('Images/carrier.png', 1, 0)
# print obj.extract_info_from_lsb("Images/crypto.png")
# image = obj.hide_in_pixel("Images/test.png", "Testing", 0)
# obj.hide_using_bpcs("Images/carrier.png", "Images/test.png", 0, 1)
# matrix = obj.image_to_matrix("Images/crypto.png")
# print matrix
# image = obj.matrix_to_image(matrix)
# print obj.image_to_matrix("Images/test.jpg")
