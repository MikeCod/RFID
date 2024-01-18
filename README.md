# RFID vulnerabilities

## Overview

This project aims to find the most suitable RFID technology for your use case, or alternatives, in addition to explain why your current solution may not be appropriate.
Moreover, a documentation is also available.


## Launch

```sh
$ docker swarm init --advertise-addr 127.0.0.1
$ docker-compose up --build
```

## FAQ
### What are RFID technologies ?

RFID (Radio Frequency Identification) technology designate, as the name suggest, a protocol that permits to identify someone or something.

### Where are RFID used ?

We use RFID technologies very often in our daily life, without us realizing it.
- Building or corporate pass
- Contactless payment
- Public transports
- ...

### What type of RFID exist ?

RFID is actually on many frequency bands.
| Band | Regulations | Range | Cas d’utilisation |
|---|---|---|---|
| LF: 120–150 kHz | *Unregulated* | 10 cm | Identification animal |
| **HF: 13.56 MHz** | **ISM band worldwide** | **0.1 – 1 m** | **Most frequently used. Include Smartcards and NFC** |
| UHF: 433 MHz | Short range devices | 1 – 100 m | Military area |
| UHF: 865–868 MHz (EU) 902–928 MHz (NA) | ISM band | 1 – 12 m | Used by railroads |
| UHF-SHF: 2450–5800 MHz | ISM band | 1 – 2 m | 802.11 WLAN, Bluetooth standards |

*[Source](https://en.wikipedia.org/wiki/Radio-frequency_identification)*

NFC is rooted in RFID, and Smartcard in NFC.
```
╔════════╗     ╔═══════╗     ╔═════════════╗
║  RFID  ╠════>║  NFC  ╠════>║  Smartcard  ║
╚════════╝     ╚═══════╝     ╚═════════════╝
```

#### NFC

NFC is designed to be more secure, not only provide **identification** :
- **Data storage** (up to 4kib) *RFID data is on a few bytes*
- **Request treatments**

NFC is made safer by its scheme, supporting anticollisions, and various features by manufacturers (although it's not very "secure").


#### Smartcards

Smartcard, in addition to the features above, provides **authentication** integrating a firmware on its chip ;
That is, __not only saying who you are, but prove that you really are you__.


## Contributors

- [Aidasaoudi](https://github.com/Aidasaoudi)
- [Rikinaze Madi Tabibou](https://github.com/Aidasaoudi)


## License

[LGPL](LICENSE)