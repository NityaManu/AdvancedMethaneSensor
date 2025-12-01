#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <math.h>

// WiFi credentials
const char* ssid = "Samsung m20";
const char* password = "27054828AB";

// Web server
WebServer server(80);

// MQ-4 Sensor Pin
#define MQ4_PIN 34  // Analog pin connected to MQ-4

// Calibration Constants (Do NOT change)
float R0 = 10.0;  // Manually set or calibrated in setup
#define RL 20.0    // Load resistance (kΩ)

// MQ-4 Methane PPM Calculation Parameters (Do NOT change)
#define SLOPE -1.7
#define INTERCEPT 0.45

void setup() {
    Serial.begin(115200);
    pinMode(MQ4_PIN, INPUT);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Start web server
    server.on("/data", []() {
        float ppm = readMQ4();
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.send(200, "text/plain", String(ppm));
    });
    server.begin();

    delay(10000); // Wait for sensor to stabilize
    Serial.println("MQ-4 Sensor Calibration");

    // Calibration in clean air
    float RsSum = 0;
    for (int i = 0; i < 100; i++) {
        int sensorValue = analogRead(MQ4_PIN);
        float voltage = sensorValue * (3.3 / 4095.0);
        float Rs = (3.3 * RL / voltage) - RL;
        RsSum += Rs;
        delay(100);
    }
    R0 = RsSum / 100.0;

    Serial.print("R0 (Calibrated in Clean Air): ");
    Serial.print(R0);
    Serial.println(" kOhms");
}

float readMQ4() {
    int sensorValue = analogRead(MQ4_PIN);
    float voltage = sensorValue * (3.3 / 4095.0);
    float Rs = (3.3 * RL / voltage) - RL;
    float ratio = Rs / R0;

    if (ratio <= 0) return 0;

    float ppm = pow(10, ((log10(ratio) - INTERCEPT) / SLOPE));

    // Debugging output
    Serial.print("Raw Sensor Value: "); Serial.println(sensorValue);
    Serial.print("Voltage: "); Serial.println(voltage, 3);
    Serial.print("Rs: "); Serial.println(Rs, 3);
    Serial.print("Rs/R0 Ratio: "); Serial.println(ratio, 3);
    Serial.print("PPM: "); Serial.println(ppm);
    Serial.println("------------------");

    return ppm;
}

void loop() {
    server.handleClient();  // Handle web client
    float methanePPM = readMQ4();

    Serial.print("Methane (CH4) PPM: ");
    Serial.print(methanePPM);
    Serial.println(" ppm");

    delay(3000);
}
