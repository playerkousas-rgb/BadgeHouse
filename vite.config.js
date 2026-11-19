import { defineConfig } from 'vite';
export default defineConfig({
 root:'public',publicDir:'static',server:{allowedHosts:['.e2b.app']},
 build:{outDir:'../dist',emptyOutDir:true,rollupOptions:{output:{manualChunks(id){
  if(id.includes('/three/build/three.core.js')) return 'three-core';
  if(id.includes('/three/build/three.module.js')) return 'three-webgl';
 }}}}
});
