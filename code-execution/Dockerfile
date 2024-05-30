# Base image for Python
FROM python:3.9

# Install necessary packages and language runtimes
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    g++ \
    && apt-get clean

# Add more language runtimes as required
# For example, adding Ruby
# RUN apt-get update && apt-get install -y ruby-full

# Create a directory for the code execution
WORKDIR /code-execution

# Add a script that will run the submitted code
COPY run-code.sh /code-execution/run-code.sh
RUN chmod +x /code-execution/run-code.sh

# Set the default command to run the code execution script
CMD ["/code-execution/run-code.sh"]
