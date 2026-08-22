#!/usr/bin/env bash
MLC=/home/roberto/mlc-llm
TVM_BUILD="$MLC/3rdparty/tvm/build"
export PYTHONPATH="$MLC/python:$MLC/3rdparty/tvm/python:$MLC/3rdparty/tvm/3rdparty/tvm_ffi/python:$PYTHONPATH"
export LD_LIBRARY_PATH="$TVM_BUILD/lib:$MLC/build/lib:/home/roberto/llvm-env/lib:$LD_LIBRARY_PATH"
ls "$MLC/3rdparty/tvm/3rdparty/tvm_ffi/python" 2>/dev/null | head -3
python3 - <<'PY'
import tvm, tvm_ffi, mlc_llm
print("tvm:", tvm.__file__)
print("tvm_ffi:", tvm_ffi.__file__)
print("mlc_llm:", mlc_llm.__file__)
PY
