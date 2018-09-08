#!/usr/bin/env python3
import time
from neopixel import Adafruit_NeoPixel, Color
# import argparse
from random import randint, choice

LED_COUNT = 120
LED_PIN = 18
LED_FREQ_HZ = 800000
LED_DMA = 10
LED_BRIGHTNESS = 255
LED_INVERT = False
LED_CHANNEL = 0

FADE_INCREMENT = 10
FADE_STEPS = 255
FADE_HOLD = 500

ZONES = (
    (0,    4),
    (5,   16),
    (17,  28),
    (29,  40),
    (41,  51),
    (52,  61),
    (62,  73),
    (74,  85),
    (86,  97),
    (98,  109),
    (110, 119),
)


def wipe(strip, color=Color(0, 0, 0)):
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)


def calculateStep(fromValue, toValue):
    step = toValue - fromValue
    if step:
        return FADE_STEPS / step
    else:
        return step


def calculateVal(step, val, i):
    if step and (i % step == 0):
        if step > 0:
            val += FADE_INCREMENT
        else:
            val -= FADE_INCREMENT

    if val > 255:
        val = 255
    elif val < 0:
        val = 0

    return val


def getColorRGB(color):
    rgb = {}
    rgb['r'] = (color & 0xff0000) >> 16
    rgb['g'] = (color & 0xff00) >> 8
    rgb['b'] = (color & 0xff)
    return rgb


def crossfade(strip, i, fromColor, toColor):
    fromRGB = getColorRGB(fromColor)
    toRGB = getColorRGB(toColor)

    prevR = fromRGB['r']
    prevG = fromRGB['g']
    prevB = fromRGB['b']

    # print('init:', rVal, gVal, bVal)

    rStep = calculateStep(fromRGB['r'], toRGB['r'])
    gStep = calculateStep(fromRGB['g'], toRGB['g'])
    bStep = calculateStep(fromRGB['b'], toRGB['b'])

    # wipe(strip)

    for j in range(FADE_STEPS):
        rVal = calculateVal(rStep, prevR, j)
        gVal = calculateVal(gStep, prevG, j)
        bVal = calculateVal(bStep, prevB, j)

        # print(rVal, gVal, bVal)

        if rVal != prevR or gVal != prevG or bVal != prevB:
            for k in range(ZONES[i][0], ZONES[i][1] + 1):
                strip.setPixelColorRGB(k, rVal, gVal, bVal)

            strip.show()
            # time.sleep(FADE_HOLD/1000.0)

        prevR = rVal
        prevG = gVal
        prevB = bVal
    # print('fina:', rVal, gVal, bVal)


def main():
    # parser = argparse.ArgumentParser()
    # args = parser.parse_args()

    strip = Adafruit_NeoPixel(
        LED_COUNT,
        LED_PIN,
        LED_FREQ_HZ,
        LED_DMA,
        LED_INVERT,
        LED_BRIGHTNESS,
        LED_CHANNEL
    )
    strip.begin()

    print('Press Ctrl-C to quit')

    # while True:
    #     for i in range(strip.numPixels()):
    #     wipe(strip)
    #     strip.setPixelColor(randint(0, strip.numPixels()), Color(255, 0, 0))
    #     strip.setPixelColor(randint(0, strip.numPixels()), Color(0, 255, 0))
    #     strip.setPixelColor(randint(0, strip.numPixels()), Color(0, 0, 255))
    #     strip.show()
    #     time.sleep(100/1000.0)

    colors = (
        Color(255, 0, 0),
        Color(0, 255, 0),
        Color(0, 0, 255),
        Color(255, 255, 0),
        Color(255, 0, 255),
        Color(0, 255, 255)
    )

    i = 0

    try:
        while True:
            color = choice(colors)
            # r = randint(0, 255)
            # g = randint(0, 255)
            # b = randint(0, 255)
            # r2 = randint(0, 255)
            # g2 = randint(0, 255)
            # b2 = randint(0, 255)
            # wipe(strip)
            # time.sleep(1)
            # i = randint(0, strip.numPixels() - 1)
            # i = randint(0, len(ZONES) - 1)
            crossfade(strip, i, Color(0, 0, 0), color)
            # crossfade(strip, i, Color(r, g, b), color)
            # crossfade(strip, i, Color(r, g, b), Color(0, 0, 0))
            # crossfade(strip, i, Color(r, g, b), Color(r2, g2, b2))
            strip.show()
            time.sleep(FADE_HOLD/1000.0)
            crossfade(strip, i, color, Color(0, 0, 0))
            i += 1
            if i > len(ZONES) - 1:
                i = 0
            # wipe(strip)
            # print('Cool')
            # time.sleep(3)

    except KeyboardInterrupt:
        wipe(strip)
        strip.show()
        print('\nGoodbye...')


if __name__ == '__main__':
    main()
