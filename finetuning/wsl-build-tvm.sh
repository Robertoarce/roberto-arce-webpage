#!/usr/bin/env bash
# Rebuild TVM with cython bindings (needed for tvm_ffi.core).
set -e
cd /home/roberto/mlc-llm/3rdparty/tvm/build

cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_C_COMPILER=/usr/bin/gcc \
  -DCMAKE_CXX_COMPILER=/usr/bin/g++ \
  -DCMAKE_PREFIX_PATH=/home/roberto/llvm-env \
  -DUSE_LLVM=/home/roberto/llvm-env/bin/llvm-config \
  -DUSE_CYTHON=ON \
  -DUSE_CUDA=OFF -DUSE_METAL=OFF -DUSE_VULKAN=OFF -DUSE_OPENCL=OFF \
  -DUSE_MICRO=OFF -DUSE_RPC=ON -DUSE_MSVC_MT=OFF \
  2>&1 | tail -3

echo "=== make -j16 ==="
make -j 16 2>&1 | tail -4
echo "DONE"
find . -name "core*.so" | head -4
