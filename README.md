# RFID vulnerabilities

## Overview

This project aims to find the most suitable RFID technology for your use case, or alternatives, in addition to explain why your current solution may not be appropriate.

Moreover, a documentation is also available.


## Launch

```sh
$ docker swarm init --advertise-addr 127.0.0.1
$ docker-compose up --build
```

## What are RFID technologies ?

RFID (Radio Frequency Identification) technology designate, as the name suggest, a protocol that permits to identify someone or something.

## Where are RFID used ?

We use RFID technologies very often in our daily life, without us realizing it.
- Building or corporate pass
- Contactless payment
- Public transports
- ...

## What type of RFID exist ?

RFID is actually on many frequency bands.
| Band | Regulations | Range | Cas d’utilisation |
|---|---|---|---|
| **LF: 120–150 kHz** | ***Unregulated*** | **10 cm** | **Animal identification, and some identification cards** |
| **HF: 13.56 MHz** | **ISM band worldwide** | **0.1 – 1 m** | **Most frequently used. Include Smartcards and NFC** |
| UHF: 433 MHz | Short range devices | 1 – 100 m | Military area |
| UHF: 865–868 MHz (EU) 902–928 MHz (NA) | ISM band | 1 – 12 m | Used by railroads |
| UHF-SHF: 2450–5800 MHz | ISM band | 1 – 2 m | 802.11 WLAN, Bluetooth standards |

*[Source](https://en.wikipedia.org/wiki/Radio-frequency_identification)*

<!-- https://en.wikipedia.org/wiki/Box-drawing_characters -->
NFC is rooted in RFID, and Contactless Smartcard in NFC.
```
╔═════════════╗     ╔═════════════╗
║    RFID     ║     ║  Smartcard  ║
╚══════╤══════╝     ╚══════╤══════╝
       │                   │
	   v                   v
╔═════════════╗     ╔═════════════╗
║     NFC     ║     ║  Smartcard  ║
╚══════╤══════╝     ╚══════╤══════╝
       └─────────┬─────────┘
                 v
 ╔═══════════════════════════════╗
 ║  CSC (Contactless Smartcard)  ║
 ╚═══════════════════════════════╝
```

| Feature | RFID | NFC | CSC |
|-|-|-|-|
| Band | 125kHz* | 13.56 MHz | 13.56 MHz |
| UID | 4 or 7 bytes | 4 or 7 bytes | 4 or 7 bytes |
| Storage | *none* | 144, 504 or 888 bytes | 1, 2, 4 or 8 kB |
| Request treatment | ❌ | ✅ | ✅ |
| Authentication Support | ❌ | ❌ | ✅ |

**: When refering to RFID, it usually refers to this band*


| Card Type                      | Auth. Support | Type | NFC Type/RFID ISO | Cryptographic Support       | Manufacturer          |
| ------------------------------ | :----------------------: | :----: | :--------: | --------------------------- | --------------------- |
| **MIFARE Classic 1/2/4 kb**    | ✅                     | CSC | A | Crypto-1 (proprietary) ?     | NXP                   |
| **MIFARE DESFire EV1/EV2/EV3** | ✅                     | CSC | A | AES, 3DES                   | NXP                   |
| **MIFARE Plus**                | ✅                     | CSC | A | AES-128                     | NXP                   |
| **MIFARE Ultralight**          | ❌                     | NFC | A | None                        | NXP                   |
| **MIFARE Ultralight C/AES/EV1/NANO** | ✅               | CSC | A | 3DES/AES/ECC                    | NXP                   |
| **Hitag 1**                    | ✅                     | CSC | ISO 18000 (?) | Proprietary encryption ?     | NXP                   |
| **Hitag 2/S**                  | ✅                     | CSC | ISO 11784/85 | Proprietary encryption ?     | NXP                   |
| **ICODE**                      | ❌                     | NFC | V | None                        | NXP                   |
| **UCODE**                      | ✅                     | CSC | ISO 18000-4,6 | None ?                       | NXP                   |
| [**LEGIC Advant/Prime**][1]    | ✅                     | CSC | A or V | AES, DES, 3DES, LEGIC encryption | LEGIC Identsystems AG |
| **Temic T5567 Proximity Card** | ❌                     | RFID | ISO 11784/85 | Password-based protection ?  | Atmel (Microchip)     |
| **LRIAK/S2K/I512, ST25TB**     | ❌                     | NFC | B | None                        | STMicroelectronics    |
| **SRIX**                       | ✅                     | CSC | B | None (?)                    | STMicroelectronics    |

| Card Type                      | Auth. Support | Type | NFC Type/RFID ISO | Cryptographic Support       | Manufacturer          |
| ------------------------------ | ---------------------- | ---- | -------- | --------------------------- | --------------------- |
| **Token2 T2F2-NFC-Card PIN+**  | ✅                     | CSC | A | ECDSA, AES                  | Token2                |
| **JCOP 31/41**                 | ✅                     | CSC | A | DES, 3DES, RSA, ECC, AES    | IBM    |
| **INSIDE PicoPass 2KS**        | ✅                     | CSC | A | DES, 3DES                   | INSIDE                |
| **IS23SC, IS24C02**            | ❌                     | CSC | A | Password-based protection ?  | ISSI                  |
| **TI Tag-it HF-1**             | ✅                     | CSC | V | None (?)                        | Texas Instruments     |
| **EM4100-4550**                | ❌                     | RFID | ISO/IEC 18000-4 |  None                        | EM Microelectronic    |
| **Jewel**                      | ❌                     | CSC | A |                         |  Innovision/Broadcom  | |

[1]: https://www.legic.com/products/smartcards/legic-smartcard-ics "LEGIC"

[Source](https://nfc-tools.github.io/resources/standards/iso14443A/)

[ATQ, SAK and ATS can be used to identify the manufacturer and product.](https://nfc-tools.github.io/resources/standards/iso14443A/)

### Norms

| Norm | NFC Tag Type | Description |
|-|-|-|
| NFCIP-1/2 (ISO/IEC 18092/21481) || Peer-to-Peer and Active Modes |
| ISO/IEC 18000-2 || RFID 120-135 kHz |
| ISO/IEC 18000-3 | *Any* | RFID for item management at 13,56 MHz |
| ISO/IEC 18000-4 || RFID 860-960 MHz |
| ISO/IEC 18000-6 || RFID 2,45 GHz |
| ISO/IEC 14443 A/B | 1/2/4 | Proximity Cards (A and B) |
| [JIS X6319-4](https://img.antpedia.com/standard/files/pdfs_ora/20240408/JIS%20X%206319-4-2016.pdf) | 3 | FeliCa (F) |
| ISO/IEC 15693 | 5 | Vicinity Cards (V) |
| NDEF (NFC Data Exchange Format) || Exchange payload format |

### Coding & Modulation

| Coding | Description | |
|-|-|-|
| NRZ-L | Voltage changes directly with bit-value logic |
| Manchester | Inverse voltage at the middle of the bit period |
| Modified Miller | 1 is always represented by high to low. 0 is mapped according to the previous bit condition: if previous bit was 1, then it remains high, otherwise a low impulse occurs at the beginning |

[Source](https://www.rfwireless-world.com/tutorials/other-wireless/nfc-modulation-explained)

| Modulation | Description | |
|-|-|-|
| ASK 100% | The signal takes the full amplitude |
| ASK 10% | The signal lower by 10% for 0 |

[Source](https://www.rfwireless-world.com/terminology/modulation/10-percent-ask-vs-100-percent-ask-modulation)

### NFC Types

| Type | Mode | Coding | Modulation | Speed |
|:-:|-|-|-|-|
| A | *Polling*   | Modified Miller | ASK 100%      | 106 kbps |
|   | *Listening* | Manchester      | *Load (ASK)*  | 106 kbps |
| B | *Polling*   | NRZ-L           | ASK 10%       | 106 ~ 848 kbps |
|   | *Listening* | NRZ-L           | *Load (BPSK)* | 106 ~ 848 kbps |
| F | *Polling*   | Manchester      | ASK 10%       | 212 ~ 424 kbps | 
|   | *Listening* | Manchester      | *Load (BPSK)* | 212 ~ 424 kbps |
| V | *Polling*   | Manchester      | ASK 10%       | 26 ~ 53 kbps |
|   | *Listening* | Manchester      | *Load (ASK)*  | 26 ~ 53 kbps |

|                         | **NFC Type A**                        | **NFC Type B**                        | **NFC Type F (FeliCa)**             | **NFC Type V (ISO 15693)**      |
| ----------------------- | ------------------------------------- | ------------------------------------- | ----------------------------------- | ------------------------------- |
| **Standard**            | ISO/IEC 14443-A                                     | ISO/IEC 14443-B                 | JIS X 6319-4 / ISO/IEC 18092        | ISO/IEC 15693                   |
| **Latency**             | Low                                                 | Low                             | Very low                            | Moderate                        |
| **Security**            | Depends on chip (e.g. MIFARE DESFire)               | Depends on chip (e.g. CAC, PIV) | High (built-in crypto, mutual auth) | Moderate (can support password) |
| **Main Use Cases**      | Access control, Payments, Government ID, Healthcare | Transports                      | Transit, Mobile payments, Access    | Industrial tracking, Libraries  |
| **Dominant Regions**    | Worldwide                                           | Europe, U.S. Government        | Japan, Hong Kong, Taiwan            | Europe, Industry (global)       |
| **Key Products**        | MIFARE Classic, DESFire, Ultralight                 | CAC cards, ePassports (ICAO)   | Suica, Octopus, Edy, nanaco         | Tag-it, ICODE, ST25             |


## Transaction Functioning

```md
╔════════════╗                              ╔════════════╗
║            ║ REQ ───────────────────────> ║            ║
║            ║ <───────────────── ATQ + SAK ║            ║
║            ║                              ║            ║
║   Reader   ║ *If ATQ + SAK is valid:*     ║    PICC    ║
║            ║                              ║            ║
║            ║ RATS ──────────────────────> ║            ║
║            ║ <─────────────────────── ATS ║            ║
╚════════════╝                              ╚════════════╝
```

### Glossary

| Abbrv. | Meaning |
|-|-|
| ATQ[X] | Answer To Request, Type X |
| SAK | Select Acknowledge (anticollision byte) |
| ATS | Answer To Select |
| RATS | Request for Answer To Select |
| REQ[X] | Request Command, Type X |
| PCD | Proximity Coupling Device (Reader) |
| PICC | Proximity Integrated Circuit (Contactless card) |

## Attacks

### Common
#### Cloning / Replay

#### Relay

#### Mfkey32 Attack - Nonce reuse

#### Jamming

### Advanced Techniques
#### Power Analysis

#### Reverse Engineering

#### Tracking


## Contributors

||||
|:-:|:-:|:-:|
| [<img src="https://avatars.githubusercontent.com/u/113185371?v=4" alt="Aidasaoudi" width="72" height="72" /><p>Aidasaoudi</p>](https://github.com/Aidasaoudi) | [<img src="https://avatars.githubusercontent.com/u/63343872?v=4" alt="Rikimadi" width="72" height="72" /><p>Rikimadi</p>](https://github.com/Rikimadi) | [<img src="https://avatars.githubusercontent.com/u/79757319?v=4" alt="Mailysss" width="72" height="72" /><p>Mailysss</p>](https://github.com/Mailysss) |
| [<img src="https://avatars.githubusercontent.com/u/43148386?v=4" alt="MikeCod" width="72" height="72" /><p>Eternal Dreamer</p>](https://github.com/MikeCod) | [<img src="https://avatars.githubusercontent.com/u/92798770?v=4" alt="BAD0896" width="72" height="72" /><p>Agrafes</p>](https://github.com/Agrafes) | [<img src="https://avatars.githubusercontent.com/u/113607960?v=4" alt="BAD0896" width="72" height="72" /><p>BAD0896</p>](https://github.com/badrou0809) |

## License

[LGPL](LICENSE)