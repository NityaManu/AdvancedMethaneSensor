# Advanced High-Sensitivity Methane Gas Sensor 
This project implements a high sensitivity methane gas sensor using graphene-coated interdigitated electrode (IDE) on a custom-designed PCB, interfaced with an ESP32 for real-time data acquisition and web visualization.

## Overview
Methane exposure causes a change in the resistance of the graphene film deposited on the IDE. A voltage divider analog front end converts this resistance change into a voltage that is sampled by the ESP32 ADC and sent to a web dashboard for monitoring and alerting.

## Hardware Features
1. Graphene-coated IDE sensing region on PCB
2. Precision voltage divider with noise filtering
3. ESP32 ADC interface and 3.3V power domain
4. Test points for calibration and multimeter diagnosis

## Software Features
1. Calibration constants stored in firmware
2. Web dashboard with real-time methane graph and threshold-based alerts

## Technologies Used
1. ESP32
2. PCB Design
3. Embedded C
4. ADC Signal Processing
5. Graphene Sensor Fabrication
6. HTML, CSS, JavaScript for Web dashboard

