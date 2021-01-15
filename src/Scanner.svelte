<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/webmidi"></script>
</svelte:head>
<script>
  import { onMount } from 'svelte';
  import * as _ from 'lodash-es';
  import DeviceScanner from './lib/device-scanner.js';
  export let result = 'Asking for WebMIDI permissions....';
  export let deviceList = [];
  function initMidi(midiAccess) {
    // console.log('Lodash: ', typeof _);
    
    // console.log(typeof midiAccess);
    // console.log('WebMIDI?', typeof WebMidi);
    WebMidi.enable(function (err) {
      if (err) throw err;
      result = 'WebMIDI available!';
      console.log('Inputs: ', WebMidi.inputs);
      console.log('Outputs: ', WebMidi.outputs);

      let dscanner = new DeviceScanner(WebMidi);

      result = 'Devices: ';
      dscanner.scanInterfaces().then((types) => {
        // console.log(typof _);
        let map = _.flatten(_.map(types, (devices) => {
          return _.map(devices, (device) => {
            return  _.pick(device, ['id', 'type', 'name']);
          });
        }));

        let byName = _.groupBy(map, 'name');
        console.log(byName);

        deviceList = _.map(byName, (device, name) => {

          // let input = _.filter(device, (item) => { return (item.type === 'input'); }).pop();
          // let output = _.filter(device, (item) => { return (item.type === 'output'); }).pop();



          let _dev = {
            name: name,
            portCount: device.length
          };

          // let 

          return _dev;

        });
      });
    });
  }
  function noMidi() {
    result = 'No WebMIDI available.';
  }
  onMount(async () => {
    navigator.requestMIDIAccess().then(initMidi, noMidi);
  });

  function handleClick(ev) {
    console.log(ev.target.id);
  }
</script>
<main>
  <div>{result}</div>
  <div id="devicelist">
    <ul>
      {#each deviceList as device}
        <li>{device.name}: {device.portCount} Ports <a id="{device.name}" href="#" on:click={handleClick}>Query</li>
      {/each}
    </ul>
  </div>
</main>

<style>
div { text-align: left; }
div#devicelist {
  min-width: 250px;
}
</style>