import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig: NextConfig = {
//   webpack: (config, { isServer }) => {
//     // Enable WebAssembly support
//     config.experiments = {
//       ...config.experiments,
//       asyncWebAssembly: true,
//     };

//     // Handle .wasm files
//     config.module.rules.push({
//       test: /\.wasm$/,
//       type: 'webassembly/async',
//     });

//     // Provide fallbacks for Node.js modules in the browser
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         path: false,
//         crypto: false,
//         buffer: require.resolve('buffer/'),
//       };
//     }

//     return config;
//   },
// };

// module.exports = nextConfig;
