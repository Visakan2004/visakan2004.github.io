# WEEK 04
## FROM SIGNALS TO CONNECTED SYSTEMS

**ProtoSem × FORGE · PRICE Fellowship**

### Turning physical signals into intelligent interactions.

Week 04 moved my learning from basic electronics into the world of **sensors, embedded systems, wireless communication, and IoT**.

What started with a simple Arduino and LED circuit gradually evolved into sensor-driven systems, an ESP32-powered OLED game, Wi-Fi connectivity, smart traffic simulation, and physical interaction using joysticks.

The common thread throughout the week was simple:

> **Sense → Process → Respond → Connect**

**STATUS:** COMPLETED  
**MODE:** Hands-on · Embedded · Experimental  
**FOCUS:** Arduino · Sensors · ESP32 · OLED · IoT · Wi-Fi · Hardware Prototyping

---

# THE WEEK IN ONE VIEW

### 01 — BUILD
**Arduino + Breadboard**

Understanding the foundation of physical computing.

### 02 — SENSE
**Sensors + Telemetry**

Capturing information from the physical environment.

### 03 — INTERACT
**ESP32 + OLED**

Combining processing, inputs, and visual output.

### 04 — CONNECT
**Wi-Fi + IoT**

Taking embedded hardware into connected systems.

---

# DAY 01
## STARTING WITH THE MICROCONTROLLER

### Focus
**Arduino Architecture & LED Circuits**

The first day established the foundation for the rest of the week.

I explored the Arduino board, its pins, basic microcontroller functionality, and how software instructions can control physical components.

### What I worked with

- Arduino board architecture
- Digital and power pins
- Breadboard connections
- LED circuits
- Basic Arduino programming
- Code-to-hardware interaction

The simple LED exercise demonstrated an important embedded-system concept:

**Code → Electrical Signal → Physical Output**

### Reflection

> **A few lines of code can create a visible physical response when software meets electronics.**

**KEY TAKEAWAY**

**Arduino + Breadboard + Code = Physical Computing Foundation**

---

# DAY 02
## TEACHING HARDWARE TO SENSE

### Focus
**Sensors · DHT11 · IR · Serial Telemetry**

Day 2 introduced the concept of giving a system awareness of its surroundings.

I explored different types of sensors and learned how physical conditions can be converted into data that a microcontroller can process.

### Sensors explored

- Light sensor
- PIR sensor
- IR sensor
- DHT11 temperature & humidity sensor
- RFID sensor

### From Input to Output

I interfaced sensors with the Arduino Uno and observed real-time values through the Serial Monitor.

The DHT11 provided temperature and humidity readings, while the IR sensor was used for detection.

I also explored how sensor conditions can trigger outputs such as LEDs and motor-driven actions.

### The embedded logic

**PHYSICAL CONDITION**  
↓  
**SENSOR INPUT**  
↓  
**MICROCONTROLLER PROCESSING**  
↓  
**DECISION / THRESHOLD**  
↓  
**ACTUATOR RESPONSE**

This was my first deeper look at how automated hardware systems make decisions based on real-world inputs.

### Reflection

> **Sensors give a system the ability to observe the physical world; logic determines what it should do with that information.**

**KEY TAKEAWAY**

**Sensor Input + Processing Logic + Output = Automated Response**

---

# DAY 03
## BUILDING INTERACTION WITH ESP32

### Focus
**ESP32 · OLED · Input Controls · Game Development**

Day 3 moved beyond basic Arduino experiments into a more capable embedded platform.

I explored the **ESP32**, including its processing capabilities, GPIO interfaces, and built-in wireless features.

### ESP32 Exploration

I compared the ESP32 with boards such as the Arduino Uno and ESP8266, focusing on:

- Processing capability
- GPIO availability
- Wireless connectivity
- Microcontroller architecture
- Embedded application possibilities

### OLED Integration

I connected an OLED display and worked with hardware inputs to create a visual interface.

Instead of simply displaying information, the display became part of an interactive application.

### Embedded Game Development

I developed and tested a custom falling-style game on the ESP32 with an OLED display.

The project combined:

**INPUT**  
↓  
User controls

**PROCESSING**  
↓  
Game logic and state updates

**RENDERING**  
↓  
OLED graphics

**OUTPUT**  
↓  
Interactive gameplay

This activity demonstrated that a microcontroller can become an entire small interactive computing system.

### Reflection

> **The ESP32 changed my perspective from controlling individual components to designing complete embedded experiences.**

**KEY TAKEAWAY**

**ESP32 + Inputs + OLED + Logic = Interactive Embedded System**

---

# DAY 04
## CONNECTING HARDWARE TO THE WORLD

### Focus
**IoT · Wi-Fi · Smart Traffic · Joystick Interfaces**

The final day introduced the most important transition of the week:

**from standalone hardware to connected hardware.**

I explored the fundamentals of IoT and how microcontrollers such as the ESP32 can communicate through wireless networks.

---

## IoT & Wi-Fi

I explored:

- IoT architecture
- Wireless communication
- Wi-Fi connectivity
- Connected embedded devices
- Hardware-to-network interaction

The ESP32 provided the bridge between physical electronics and network-connected systems.

### The basic IoT model

**PHYSICAL WORLD**  
↓  
**SENSORS / INPUTS**  
↓  
**ESP32**  
↓  
**WI-FI NETWORK**  
↓  
**CONNECTED SYSTEM**

---

# SMART TRAFFIC SYSTEM

As part of the practical work, I built a traffic-light simulation using red, yellow, and green LEDs.

The project demonstrated how programmed timing and sequential logic can reproduce the behaviour of a real-world traffic control system.

### System flow

**RED**  
↓  
**GREEN**  
↓  
**YELLOW**  
↓  
**REPEAT**

This simple prototype demonstrated how embedded controllers can reproduce real-world control systems using inexpensive hardware.

---

# DUAL-JOYSTICK INTERACTION

I also worked with dual analog joystick modules connected to the ESP32.

This introduced another type of hardware input — continuous analog control.

The joysticks could be used as a physical interface for interactive applications and game-style prototypes.

### Concept

**JOYSTICK MOVEMENT**  
↓  
**ANALOG INPUT**  
↓  
**ESP32 PROCESSING**  
↓  
**APPLICATION RESPONSE**

This opened up possibilities for more interactive embedded projects.

### Reflection

> **Connecting a microcontroller to Wi-Fi transforms it from an isolated device into a participant in a larger digital system.**

**KEY TAKEAWAY**

**Hardware + Sensors + Wi-Fi + Logic = IoT Foundation**

---

# WEEK 04 SYNTHESIS

## FROM A BLINKING LED TO CONNECTED SYSTEMS

Week 04 followed a clear progression.

### 01 — CONTROL

**Arduino**

I learned how software instructions can directly control physical hardware.

↓

### 02 — SENSE

**Sensors**

I learned how hardware can collect information from the environment.

↓

### 03 — COMPUTE & INTERACT

**ESP32 + OLED**

I combined processing, inputs, and visual output into an interactive embedded application.

↓

### 04 — CONNECT

**Wi-Fi + IoT**

I explored how embedded systems can communicate through networks.

↓

### 05 — PROTOTYPE

**Smart Traffic + Joystick Systems**

I applied these concepts to physical and interactive prototypes.

---

# THE ENGINEERING LOOP

The biggest concept I took from Week 04 was the complete embedded-system loop:

### SENSE
Capture information from the physical environment.

↓

### PROCESS
Use programmed logic to interpret the input.

↓

### RESPOND
Control an LED, motor, display, or other output.

↓

### CONNECT
Use networking to extend the system beyond the device.

↓

### ITERATE
Test, identify issues, modify, and improve.

---

# WHAT I EXPLORED

| Area | Practical Experience |
|---|---|
| Arduino | Board architecture, programming and GPIO |
| Electronics | Breadboard wiring and LED circuits |
| Sensors | Light, PIR, IR, DHT11 and RFID |
| Telemetry | Real-time Serial Monitor readings |
| ESP32 | Microcontroller architecture and GPIO |
| OLED | Display interfacing and graphics |
| Embedded Development | Interactive game development |
| IoT | Wi-Fi and connected hardware concepts |
| Control Systems | Smart traffic-light prototype |
| Interaction | Dual analog joystick interface |

---

# WHAT WEEK 04 CHANGED

Week 04 helped me understand that embedded systems are not simply about connecting components.

They are about creating a relationship between the **physical world and digital logic**.

A sensor captures something happening around us.

A microcontroller interprets it.

An output responds.

A network can then connect that system to something beyond the device itself.

That progression changed the way I think about IoT:

> **IoT is not just about putting a device online. It is about connecting physical events, computation, decisions, and actions into one system.**

---

# WEEK 04 IN ONE LINE

> **I started with a blinking LED and ended the week exploring connected systems — learning how hardware can sense, compute, respond, interact, and communicate.**

---

## NEXT DESTINATION

### WEEK 05
**Another experiment. Another layer of the ProtoSem journey.**

**07 / 20 COMPLETED**  
**35% OF THE JOURNEY**
