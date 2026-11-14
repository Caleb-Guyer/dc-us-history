// Photographed CC0 PBR surfaces from Poly Haven. Local, verified 1K JPEG maps.
// Albedo is sRGB; OpenGL normals and roughness are linear data textures.
// physicalSize is the photographed tile width in metres, for world-scale UVs.
const maps=(kind,asset,physicalSize,repeat,normalScale)=>({
 albedo:`c13-real-${kind}-color.jpg`,
 normal:`c13-real-${kind}-normal.jpg`,
 roughness:`c13-real-${kind}-roughness.jpg`,
 physicalSize,repeat,normalScale,source:`https://polyhaven.com/a/${asset}`,license:'CC0-1.0'
});
export const MATERIAL_ASSETS={
 wood:maps('wood','wood_floor_worn',2,[4,5],.28),
 brick:maps('brick','worn_brick_wall',2,[4,4],.6),
 stone:maps('stone','cobblestone_floor_02',2,[8,48],.65),
 plaster:maps('plaster','plastered_wall_02',2.23,[3,3],.22),
 cloth:{normal:'c13-real-cloth-normal.jpg',roughness:'c13-real-cloth-roughness.jpg',physicalSize:.5,repeat:[4,4],normalScale:.12,source:'https://polyhaven.com/a/fabric_pattern_05',license:'CC0-1.0'}
};
export const MATERIAL_FILES=Object.values(MATERIAL_ASSETS).flatMap(asset=>['albedo','normal','roughness'].map(kind=>asset[kind]).filter(Boolean));
