#!/usr/bin/env bash
# Install LLVM 18 via micromamba (no sudo) and rebuild mlc-llm against it.
set -e
cd /home/roberto
export PATH="/home/roberto/bin:$PATH"

if [ ! -f bin/micromamba ]; then
  echo "=== downloading micromamba ==="
  mkdir -p /tmp/mm && cd /tmp/mm
  curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xj bin/micromamba
  mkdir -p /home/roberto/bin
  cp bin/micromamba /home/roberto/bin/micromamba
  chmod +x /home/roberto/bin/micromamba
  cd /home/roberto
fi

if [ ! -d llvm-env/lib/cmake/llvm ]; then
  echo "=== creating llvm-env (conda-forge llvmdev 18) ==="
  micromamba create -y -p /home/roberto/llvm-env -c conda-forge llvmdev=18 2>&1 | tail -3
fi

export LD_LIBRARY_PATH="/home/roberto/llvm-env/lib:$LD_LIBRARY_PATH"
/home/roberto/llvm-env/bin/llvm-config --version

cd /home/roberto/mlc-llm/build
cat > config.cmake <<'EOF'
set(TVM_SOURCE_DIR /home/roberto/mlc-llm/3rdparty/tvm)
set(CMAKE_BUILD_TYPE RelWithDebInfo)
set(USE_CUDA OFF)
set(USE_CUTLASS OFF)
set(USE_CUBLAS OFF)
set(USE_ROCM OFF)
set(USE_VULKAN OFF)
set(USE_METAL OFF)
set(USE_OPENCL OFF)
set(USE_OPENCL_ENABLE_HOST_PTR OFF)
set(USE_LLVM ON)
EOF

echo "=== cmake ==="
cmake .. -DCMAKE_PREFIX_PATH=/home/roberto/llvm-env 2>&1 | tail -3
echo "=== make -j16 ==="
make -j 16 2>&1 | tail -4
echo "BUILD DONE"
find /home/roberto/mlc-llm/build -name "libtvm*" | head
