// import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import livereload from 'rollup-plugin-livereload';
import svelte from 'rollup-plugin-svelte-hot';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

// const production = !process.env.ROLLUP_WATCH;
const production = false;

const hot = !production;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start' ], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		// svelte({
		// 	compilerOptions: {
		// 		// enable run-time checks when not in production
		// 		dev: !production
		// 	}
    // }),
    svelte({
      // Use `hot: true` to use default options (as follow).
      //
      // Set `hot: false` to completely disable HMR shenanigans (you need this
      // for `npm run build`, for example).
      //
      hot: hot && {
        // Prevent preserving local component state
        noPreserveState: false,

        // If this string appears anywhere in your component's code, then local
        // state won't be preserved, even when noPreserveState is false
        noPreserveStateKey: '@!hmr',

        // Prevent doing a full reload on next HMR update after fatal error
        noReload: false,

        // Try to recover after runtime errors in component init
        optimistic: false,

        // --- Advanced ---

        // By default, when the hot option is enabled, the `css` option of this
        // plugin (same option as official plugin) will be changed to `false`,
        // because extracting CSS doesn't work with HMR currently. You can use
        // this option to disable this behaviour if it cause problems with your
        // setup.
        // noDisableCss: true,

        // // When you change only the <style> part of a component, then only the
        // // CSS will be reinjected. Existing component instances won't be
        // // recreated. Set `false` to force recreation.
        // injectCss: true,

        // // Delay to mitigate FOUC (flash of unstyled content) when a component
        // // is updated, before the new version with the new CSS is loaded.
        // cssEjectDelay: 100,

        // // Prevent adding an HMR accept handler to components with
        // // accessors option to true, or to components with named exports
        // // (from <script context="module">). This have the effect of
        // // recreating the consumer of those components, instead of the
        // // component themselves, on HMR updates. This might be needed to
        // // reflect changes to accessors / named exports in the parents,
        // // depending on how you use them.
        // acceptAccessors: false,
        // acceptNamedExports: false,

        // // Set true to enable support for Nollup (note: when not specified, this
        // // is automatically detected based on the NOLLUP env variable)
        // nollup: false,
      },

      // `dev: true` is required with HMR
      dev: hot,

      // Separate CSS file is not supported during HMR (neither with Nollup
      // nor rollup-plugin-hot), so we just disable it when `hot` is true.
      ...(!hot && {
        css: css => {
          css.write('public/bundle.css')
        },
      }),
    }),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		// css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// !production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

