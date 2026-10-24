export class TestBucket {
 files=new Map();sequence=0;
 async get(key){const item=this.files.get(key);if(!item)return null;return {etag:item.etag,body:typeof item.value==='string'?new TextEncoder().encode(item.value):item.value,json:async()=>JSON.parse(item.value)}}
 async put(key,value,options={}){const old=this.files.get(key),condition=options.onlyIf;if(condition instanceof Headers&&condition.get('If-None-Match')==='*'&&old)return null;if(condition?.etagMatches&&condition.etagMatches!==old?.etag)return null;const etag=String(++this.sequence);this.files.set(key,{value,etag});return {etag}}
}
