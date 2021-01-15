import * as _ from 'lodash-es';
/**

Sysex details:

1. send message to get an identity packet back:

00  F0 7E 7F 06 01 F7                                 | ~    |

2. recieve packet back , eg from the blofeld:

00  F0 7E 01 06 02 3E 13 00  00 00 31 2E 32 34 F7     | ~   >    1.24 |

 */
class DeviceScanner {
  constructor(webmidi) {
    this.webmidi = webmidi;
  }

  scanInterfaces() {
    let ERR = null, inputs, outputs;
    try {
      inputs = _.map(this.webmidi.inputs, (device) => {
        return device;
      });
  
      outputs = _.map(this.webmidi.outputs, (device) => {
        return device;
      });
    } catch (error) {
      ERR = error;
    }

    return new Promise((resolve, reject) => {
      if (ERR) {
        reject(ERR);
      }
      else {
        resolve({
          inputs: inputs,
          outputs: outputs
        });
      }
    });
  }
}

export default DeviceScanner = DeviceScanner;
