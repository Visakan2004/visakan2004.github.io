; ==========================================================
; BAMBU STUDIO GENERATED G-CODE — KCT FORGE FABRICATION LOG
; ==========================================================
; PRINTER_MODEL: Bambu Lab H2S
; NOZZLE_DIAMETER: 0.40 mm
; FILAMENT_TYPE: PLA Matte (Dark Gray)
; ESTIMATED_TIME: 1h 22m 14s (Prep: 5m 25s, Model: 1h 16m 49s)
; FILAMENT_MASS: 41.55 g (Model: 40.24 g, Support: 1.31 g)
; FILAMENT_LENGTH: 13.09 m (Model: 12.68 m, Support: 0.41 m)
; LAYER_HEIGHT: 0.20 mm
; INITIAL_LAYER_HEIGHT: 0.20 mm
; PRINT_TEMPERATURE: 220 C
; BED_TEMPERATURE: 55 C
; INFILL_DENSITY: 15% (Gyroid)
; TOTAL_LAYERS: 125
; DATE: 2026-10-04 KCT Forge FabLab

; --- MACHINE START G-CODE SEQUENCE ---
M73 P0 R82 ; Set build percentage 0%, 82 minutes remaining
G90 ; Absolute coordinates
M83 ; Relative extruder mode
M104 S140 ; Soft preheat nozzle to prevent oozing
M140 S55 ; Bed target temperature
G28 ; Home all axes
G29.1 Z0.0 ; Clear live Z-offset

; Chamber fan and exhaust control
M106 P2 S128 ; 50% chamber auxiliary circulation
M190 S55 ; Wait for bed temperature to stabilize

; Active Vibration Resonance Sweeps
M973 S3 ; Execute CoreXY dual-axis resonance calibration
G1 Z5.0 F3000 ; Lift nozzle
G1 X10.0 Y10.0 F18000 ; Rapid travel to purge chute
M109 S220 ; Heat nozzle to active extrusion temperature (220 C)

; Nozzle purge and nozzle-wiper sweep
G1 E15.0 F300 ; Extrude 15mm purge noodle
G1 X25.0 Y10.0 F12000 ; Fast wipe across rubber deflector
G92 E0 ; Reset extrusion datum

; --- PURGE LINE EXTRUSION (TEXTURED PEI BED) ---
G1 Z0.20 F1200
G1 X18.0 Y20.0 F6000
G1 Y120.0 E8.25 F1500 ; Front edge calibration bead
G1 X18.4 Y120.0 F6000
G1 Y20.0 E16.50 F1500 ; Second parallel compaction bead
G92 E0

; --- LAYER 1 / 125 (Z = 0.20 mm) ---
; TYPE: Skirt / Brim
G1 Z0.200 F1200
G1 X95.420 Y95.310 F15000 ; Rapid travel to component origin
G1 X154.580 Y95.310 E1.8245 F3000
G1 X154.580 Y154.690 E3.6490 F3000
G1 X95.420 Y154.690 E5.4735 F3000
G1 X95.420 Y95.310 E7.2980 F3000

; TYPE: Outer Knurled Wall (Perimeter Facets)
; Active fan speed 100% after layer 2
G1 X98.150 Y98.150 E7.8500 F4500
G1 X102.340 Y96.280 E8.3200 F4500
G1 X106.850 Y95.120 E8.8100 F4500
G1 X111.450 Y94.850 E9.3000 F4500
; [Toolpath truncated for distribution: 125 layers of 0.20mm knurled rotary deposition]

; --- LAYER 125 / 125 (Z = 25.00 mm) ---
; TYPE: Top Solid Infill (Smooth Matte Top Layer)
G1 Z25.000 F1200
G1 X105.000 Y105.000 F18000
G1 X145.000 Y145.000 E38.4500 F3600
G1 X145.400 Y145.000 F18000
G1 X105.000 Y104.600 E39.1200 F3600

; --- MACHINE END G-CODE SEQUENCE ---
M73 P100 R0 ; Complete 100%
M104 S0 ; Extruder heater off
M140 S0 ; Bed heater off
M106 S0 ; Part cooling fan off
M106 P2 S0 ; Auxiliary chamber fan off
G91 ; Relative positioning
G1 E-2.0 F1800 ; Retract 2mm filament to prevent nozzle crystallization
G1 Z10.0 F1200 ; Drop build plate 10mm away from printed component
G90 ; Absolute positioning
G1 X10.0 Y240.0 F15000 ; Park printhead at rear maintenance corner
M84 ; Stepper motors idle / release
; PRINT JOB COMPLETED SUCCESSFULLY
