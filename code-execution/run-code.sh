#!/bin/bash

# Extract the command-line arguments
LANGUAGE=$1
CODE=$2

# Function to run Python code
run_python() {
    echo "$CODE" > script.py
    python3 script.py
}

# Function to run Node.js code
run_nodejs() {
    echo "$CODE" > script.js
    node script.js
}

# Function to run C++ code
run_cpp() {
    echo "$CODE" > script.cpp
    g++ script.cpp -o script.out
    ./script.out
}

# Function to run Java code
run_java() {
    echo "$CODE" > Main.java
    javac Main.java
    java Main
}

# Function to run C code
run_c() {
    echo "$CODE" > script.c
    gcc script.c -o script.out
    ./script.out
}

# Run the appropriate function based on the language
case $LANGUAGE in
    python)
        run_python
        ;;
    nodejs)
        run_nodejs
        ;;
    cpp)
        run_cpp
        ;;
    java)
        run_java
        ;;
    c)
        run_c
        ;;
    *)
        echo "Unsupported language: $LANGUAGE"
        exit 1
        ;;
esac
