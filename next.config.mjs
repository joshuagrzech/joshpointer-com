/** @type {import('next').NextConfig} */
const nextConfig = {
  test: /\.(glb|gltf)$/,
  type: "asset/resource",
};

export default nextConfig;
