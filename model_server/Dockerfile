# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# Base image
FROM us-docker.pkg.dev/vertex-ai/prediction/pytorch-gpu.2-1:latest

# Install necessary dependencies
RUN pip install Flask==2.3.2
RUN pip install sentence-transformers==2.3.1

# Working directory in the container
WORKDIR /app

# Copy your application code
COPY . /app

# Define the entry point to start your serving mechanism
ENTRYPOINT ["python", "serve.py"]