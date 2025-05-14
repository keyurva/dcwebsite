from fastmcp import FastMCP
import asyncio
from datacommons_client.client import DataCommonsClient

mcp = FastMCP("FastMCP Demo Server")

DC_API_KEY = "AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI"
dc = DataCommonsClient(api_key=DC_API_KEY)

SVS: dict[str, str] = {
    "population": "Count_Person",
    "fertility rate": "FertilityRate_Person_Female",
    "life expectancy": "LifeExpectancy_Person",
}

PLACES: dict[str, str] = {
    "united states": "country/USA",
    "us": "country/USA",
    "india": "country/IND",
    "nyc": "geoId/3651000",
    "la": "geoId/0644000",
    "mumbai": "wikidataId/Q2341660",
}


@mcp.tool()
def fetch_dc_stats_data(statistical_variable: str, place: str) -> str:
  """Fetch time series data for a given statistical variable and place.
  Args:
    statistical_variable (str): The statistical variable to fetch. e.g. "population", "literacy rate", "gdp", etc.
    place (str): The place to fetch the data for. e.g. "United States", "India", "NYC", etc.
    Returns:
      str: A string representation of the data. The string has the following format:
        === Data ===

        Date,Value
        2020-01-01,1000
        2020-02-01,2000
        2020-03-01,3000

        === Metadata ===

        measurementMethod: CensusACS1yrSurvey
        provenanceUrl: https://www.wikipedia.org

        If the data is not found, the string will be "No data found."
        Use provenanceUrl to cite the source of the data followed by the text "(powered by Data Commons)".
  """
  sv = SVS.get(statistical_variable.lower(), "")
  place = PLACES.get(place.lower(), "")

  if not sv or not place:
    raise ValueError()

  response = dc.observation.fetch(
      variable_dcids=[sv],
      entity_dcids=[place],
      date="all",
  )

  return _obs_response_to_text(response.to_dict())


@mcp.tool()
def echo(s: str) -> int:
  """Echo the input string"""
  return f'Hello {s}!'


def _obs_response_to_text(data: dict):
  output_lines = []
  facet_id = ''

  by_variable = data.get("byVariable", {})
  var = next(iter(by_variable), '')
  var_content = by_variable.get(var, {})

  by_entity = var_content.get("byEntity", {})
  entity = next(iter(by_entity), '')
  entity_content = by_entity.get(entity, {})

  ordered_facets = entity_content.get("orderedFacets", [])
  first_facet = ordered_facets[0] if ordered_facets else {}
  observations = first_facet.get("observations", [])
  facet_id = first_facet.get('facetId', '')

  if not observations:
    return "No data found."

  output_lines.append('=== Data ===')
  output_lines.append('')
  output_lines.append('Date,Value')

  for obs in observations:
    output_lines.append(f'{obs["date"]},{obs["value"]}')

  output_lines.append('')

  facets_map = data.get("facets", {})
  metadata = facets_map.get(str(facet_id), {})

  output_lines.append(_metadata_to_text(metadata))

  return "\n".join(output_lines)


def _metadata_to_text(metadata: dict):
  if not metadata:
    return ""

  output_lines = []
  output_lines.append('')
  output_lines.append('=== Metadata ===')
  output_lines.append('')
  for key, value in metadata.items():
    output_lines.append(f"{key}: {value}")
  output_lines.append('')
  return "\n".join(output_lines)


if __name__ == "__main__":
  asyncio.run(mcp.run_sse_async(host="0.0.0.0", port=8080))
