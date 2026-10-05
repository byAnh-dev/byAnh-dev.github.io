# World map source

`land.geojson` is Natural Earth's 1:110m land dataset, downloaded from the [Natural Earth repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson). Natural Earth data is public domain.

`../generate-journey-map.mjs` samples that geometry into a 6-unit pixel grid and writes the local `journey-map.svg`. No map service or external request is needed at runtime. The map uses an equirectangular projection cropped to 85°N–65°S; routes are illustrative, not actual flight paths. Japan is represented at country level and Kansas at state level, without implying an airport or city.
