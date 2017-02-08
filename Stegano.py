import cv2
import binascii
from PIL import Image


class Stegano:

    def image_to_matrix(self, path):
        matrix = cv2.imread(path)
        return matrix

    def matrix_to_image(self, matrix):
        image = Image.fromarray(matrix)
        image.save('crypt.png')
        return image

    def text_to_bits(self, text, encoding='utf-8', errors='surrogatepass'):
        bits = bin(int(binascii.hexlify(
            text.encode(encoding, errors)), 16))[2:]
        return bits.zfill(8 * ((len(bits) + 7) // 8))

    def text_from_bits(self, bits, encoding='utf-8', errors='surrogatepass'):
        n = int(bits, 2)
        return int2bytes(n).decode(encoding, errors)

    def hide_in_lsb(self, path, message):
        matrix = self.image_to_matrix(path)
        bit_message = str(self.text_to_bits(message))
        message_size = len(bit_message)
        message_counter = 0
        finish_flag = False

        for pixel in matrix:
            for color in pixel:

                if(message_counter == message_size):
                    finish_flag = True
                    break
                stegano_bit = 1 if ord(bit_message[message_counter]) == 49 else 0
                color ^= (-( stegano_bit ) ^ color) & (1 << 1)                #Setting LSB to 1 or 0

            if(finish_flag == True):
                break
        
        stegano_image = self.matrix_to_image(matrix)
        return stegano_image


obj = Stegano()
image = obj.hide_in_lsb("Images/kmp.png", "Hello")
image.show()
