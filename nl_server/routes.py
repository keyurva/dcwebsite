# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json

from flask import Blueprint, current_app, escape, request
from typing import Any, Dict

bp = Blueprint('main', __name__, url_prefix='/')


@bp.route('/')
def helloworld():
  return json.dumps({"data": "hello data commons"})


@bp.route('/api/search_sv/', methods=['GET'])
def search_sv():
  """Returns a dictionary with the following keys and values
  
  {
    'SV': List[str]
    'CosineScore': List[float],
    'EmbeddingIndex': List[int],
    'SV_to_Sentences': Dict[str, str]
  }
  """
  query = str(escape(request.args.get('q')))
  nl_embeddings = current_app.config['NL_EMBEDDINGS']
  return json.dumps(nl_embeddings.detect_svs(query))