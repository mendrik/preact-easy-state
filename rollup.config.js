import resolve from 'rollup-plugin-node-resolve'
import tsc from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import minify from 'rollup-plugin-minify'

import pkg from './package.json'

export default {
    input: 'src/typescript/quill.ts',
    treeshake: false,
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            banner: `/* flash v${pkg.version} */`,
            exports: 'named'
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            banner: `/* flash v${pkg.version} */`,
            exports: 'named'
        }
    ],
    plugins: [
        commonjs(),
        postcss(),
        resolve({
            browser: true
        }),
        tsc({
            tsconfigOverride: {
                compilerOptions: {
                    "module": "ES2015",
                    "target": "es5",
                    "declaration": true
                },
                clean: true
            }
        }),
        minify({
            cjs: "lib/quill.min.js"
        })
    ],
    external: [
        'preact'
    ]
}
