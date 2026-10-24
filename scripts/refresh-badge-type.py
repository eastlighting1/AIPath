"""Outline Inter lettering so SVG badges remain crisp in images and exports.
Requires fonttools and brotli. Run once when updating badge typography.
"""
from pathlib import Path
import re, xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
root = Path(__file__).resolve().parents[1]
font = instantiateVariableFont(TTFont(root/'public/fonts/InterVariable.woff2'), {'wght': 720}, inplace=True)
glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); units=font['head'].unitsPerEm
def outline(text,x,y,size,color,spacing=0,center=True):
    scale=size/units
    widths=[glyphs[cmap[ord(c)]].width*scale for c in text]
    width=sum(widths)+spacing*(len(text)-1)
    left=x-width/2 if center else x
    paths=[]
    for c,w in zip(text,widths):
        pen=SVGPathPen(glyphs);glyphs[cmap[ord(c)]].draw(pen)
        paths.append(f'<path transform="translate({left:.3f} {y}) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>')
        left+=w+spacing
    return f'<g fill="{color}" aria-label="{text}">'+''.join(paths)+'</g>'
for file in (root/'public/badges').glob('*-specory.svg'):
    svg=file.read_text(encoding='utf-8')
    if '<text' not in svg: continue
    def replace(m):
        el=ET.fromstring(m.group());a=el.attrib;text=el.text or '';size=float(a['font-size']);color=a['fill']
        if text=='SPECORY':return outline(text,271,153,33,'#142427',1.2,False)
        if size==24:return outline(text,320,245,27,color,4)
        if size==22:return outline(text,320,418,27,color,.5)
        y=float(a['y']);y=326 if y==330 else 297 if y==307 else 350
        return outline(text,320,y,49,'#101F24',-.9)
    svg=re.sub(r'<text\b[^>]*>[^<]*</text>',replace,svg)
    svg=svg.replace('x="141" y="385" width="358" height="52" rx="26"','x="124" y="378" width="392" height="60" rx="30"')
    file.write_text(svg,encoding='utf-8')
    code=file.name.split('-')[0]
    for suffix in ['', '-symbol','-bronze']:
        alias=file.with_name(code+suffix+'.svg')
        if alias.exists():alias.write_text(svg,encoding='utf-8')
print('Updated 12 badge families with outlined Inter lettering')
