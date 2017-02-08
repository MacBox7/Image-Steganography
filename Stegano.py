import binascii
import numpy as np
from PIL import Image


class Stegano:

    def image_to_matrix(self, path):
        image = Image.open(path)
        matrix = np.array(image)
        return matrix

    def matrix_to_image(self, matrix):
        image = Image.fromarray(matrix)
        image.save('Images/crypto.png')
        return image

    def int2bytes(self, i):
        hex_string = '%x' % i
        n = len(hex_string)
        return binascii.unhexlify(hex_string.zfill(n + (n & 1)))

    def text_to_bits(self, text, encoding='utf-8', errors='surrogatepass'):
        bits = bin(int(binascii.hexlify(
            text.encode(encoding, errors)), 16))[2:]
        return bits.zfill(8 * ((len(bits) + 7) // 8))

    def text_from_bits(self, bits, encoding='utf-8', errors='surrogatepass'):
        n = int(bits, 2)
        return self.int2bytes(n).decode(encoding, errors)

    def set_bit(self, number, index, flag):  # index starts from 0 where 0 is LSB
        # Compute mask, an integer with just bit 'index' set.
        mask = 1 << index
        # Clear the bit indicated by the mask (if flag is False)
        number &= ~mask
        if flag:
            # If flag was True, set the bit indicated by the mask.
            number |= mask
        return number

    def hide_in_lsb(self, path, message):
        matrix = self.image_to_matrix(path)
        bit_message = str(self.text_to_bits(message))
        message_size = len(bit_message)
        message_counter = 0
        finish_flag = False

        for row_idx, row in enumerate(matrix):
            for pixel_idx, pixel in enumerate(row):
                for color_idx, color in enumerate(pixel):

                    if(message_counter == message_size):
                        finish_flag = True
                        break
                    stegano_bit = True if ord(
                        bit_message[message_counter]) == 49 else False
                    message_counter += 1
                    # Setting LSB to 1 or 0
                    matrix[row_idx][pixel_idx][
                        color_idx] = self.set_bit(color, 0, stegano_bit)

                if(finish_flag == True):
                    break
            if(finish_flag == True):
                break

        stegano_image = self.matrix_to_image(matrix)
        return stegano_image

    def extract_info_from_lsb(self, path):
        lsb_message_list = []
        matrix = self.image_to_matrix(path)
        count = 0
        for row in matrix:
            for pixel in row:
                for color in pixel:
                    lsb = color & 1
                    lsb_message_list.append(lsb)

        lsb_message = ''.join(str(x) for x in lsb_message_list)
        #lsb_message = self.text_from_bits(lsb_message)
        return lsb_message


obj = Stegano()
image = obj.hide_in_lsb("Images/test.png", "Hello")
matrix = obj.image_to_matrix("Images/crypto.png")
print matrix
# image = obj.matrix_to_image(matrix)
# print obj.image_to_matrix("Images/test.jpg")
