# Chapter 13 art and materials

The Reform Years uses local 3D geometry, period clothing and photographed surface maps. Nell, Elias and Martha are fictional people. Head variants, skin colors, fitted garments and working poses distinguish the cast. The 8.4 update connects deforming shoulder, torso, sleeve and hand surfaces, adjusts apron and collar fit, and corrects contact with work props. Scenes are teaching settings rather than literal reconstructions of particular rooms or streets.

## Photographed materials

The following **Poly Haven** materials are redistributed as 1K JPEG maps under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). [Poly Haven’s asset license](https://polyhaven.com/license) explicitly permits use, modification and redistribution. Every map is bundled locally; the game does not contact Poly Haven while running.

| Surface | Source | Artist | Bundled maps |
| --- | --- | --- | --- |
| Worn pine boards | [Wood Floor Worn](https://polyhaven.com/a/wood_floor_worn) | Dimitrios Savva | Diffuse, OpenGL normal, roughness |
| Weathered masonry | [Worn Brick Wall](https://polyhaven.com/a/worn_brick_wall) | Amal Kumar | Diffuse, OpenGL normal, roughness |
| Worn cobblestone | [Cobblestone Floor 02](https://polyhaven.com/a/cobblestone_floor_02) | Rob Tuytel | Diffuse, OpenGL normal, roughness |
| Plaster | [Plastered Wall 02](https://polyhaven.com/a/plastered_wall_02) | Charlotte Baglioni | Diffuse, OpenGL normal, roughness |
| Woven cloth detail | [Fabric Pattern 05](https://polyhaven.com/a/fabric_pattern_05) | Rob Tuytel | OpenGL normal and roughness; clothing colors are authored separately |

The texture pack contains fourteen maps, all 1024×1024 pixels, totaling 7,606,921 bytes. The runtime files use the `c13-real-` prefix in the static site root. Files were downloaded from exact URLs supplied by Poly Haven’s official metadata and verified against the provider’s MD5 hashes. Local SHA-256 records are retained privately with the release audit. Normal and roughness maps are linear data, while color maps use sRGB.

## Character geometry

Character heads, articulated hands and the connected clothed shoulder, torso and sleeve surfaces derive from the **MakeHuman Community** base mesh. They have been adapted to the game’s proportions, clothing and animation. MakeHuman’s [official core asset license](https://www.makehumancommunity.org/about/license.html) and [repository asset terms](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.md) identify the base mesh and its derivatives as CC0. The [full CC0 asset statement](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.ASSETS.md) is separate from the application’s source-code license.

The published geometry contains the derivatives used by clothed characters. The original full-body asset and bare source mesh remain private, along with extraction scripts and classroom files. Hair, bonnets, aprons, shirt and coat layers, skirts and boots are authored for this game, as are its materials, poses, environments and camera tracks. The characters are not photographs or historical likenesses.

Three.js remains under its existing [MIT license](THREE-LICENSE.txt). The historical scope is documented in [Chapter 13 sources](C13-SOURCES.md).
