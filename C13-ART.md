# Chapter 13 art and materials

The Reform Years uses local 3D geometry, anatomical character work, period clothing and photographed surface maps. Nell, Elias and Martha are fictional people, not likenesses of historical figures. Four restrained head variants, vertex skin colors, tailored garment profiles and authored working poses provide variation. Scenes are teaching settings rather than literal reconstructions of particular rooms or streets.

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

The character head geometry is derived from the **MakeHuman Community** base mesh and adapted for clothed, animated period characters. MakeHuman’s [official core asset license](https://www.makehumancommunity.org/about/license.html) and [repository asset terms](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.md) identify the base mesh and its derivatives as CC0. The [full CC0 asset statement](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.ASSETS.md) is separate from the application’s source-code license.

Only the derived character geometry used by the clothed game is included. The original full-body source asset, private extraction scripts and classroom chapter files are not publication assets. Clothing, hair, proportions, materials, poses, environments and cinematic composition are authored for this game; they are not photographs of people who lived through these events.

Three.js remains under its existing [MIT license](THREE-LICENSE.txt). The historical scope is documented in [Chapter 13 sources](C13-SOURCES.md).
