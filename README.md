# AdvancedMethaneSensor
This project implements a high sensitivity methane gas sensor using graphene-coated interdigitated electrode (IDE) on a custom-designed PCB, interfaced with an ESP32 for real-time data acquisition and web visualization.

## Overview
Methane exposure causes a change in the resistance of the graphene film deposited on the IDE. A voltage divider analog front end converts this resistance change into a voltage that is sampled by the ESP32 ADC and sent to a web dashboard for monitoring and alerting.

