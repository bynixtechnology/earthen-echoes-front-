// Full responsive HeroSection
// Uses resize listener, image first on mobile, responsive buttons/stats.
// Replace this file with the implementation below.

import React,{useEffect,useState} from "react";
import {ArrowRight, ShieldCheck, Star} from "lucide-react";
import {Link} from "react-router-dom";
import {C,img} from "../../../constants/theme";

export default function HeroSection(){
const [mobile,setMobile]=useState(false);

useEffect(()=>{
 const onResize=()=>setMobile(window.innerWidth<768);
 onResize();
 window.addEventListener("resize",onResize);
 return ()=>window.removeEventListener("resize",onResize);
},[]);

const stats=[["12K+","Happy Customers"],["500+","Products"],["15+","Years Heritage"]];

return (
<section style={{
minHeight:mobile?"auto":"100vh",
padding:mobile?"30px 16px":"40px",
display:"flex",
alignItems:"center",
background:"linear-gradient(135deg,#FDF0E8 0%,#FDF8F3 45%,#E8F7F8 100%)"
}}>
<div style={{
maxWidth:1280,
margin:"0 auto",
width:"100%",
display:"flex",
flexDirection:mobile?"column":"row",
gap:mobile?24:80,
alignItems:"center"
}}>

<div style={{flex:1,order:mobile?2:1,width:"100%"}}>
<div style={{display:"inline-flex",padding:"6px 14px",borderRadius:999,background:"rgba(241,105,55,.12)",color:C.coral,fontWeight:700,fontSize:11}}>JAIPUR HERITAGE COLLECTION</div>

<h1 style={{fontFamily:"Playfair Display,serif",fontSize:mobile?32:68,lineHeight:1.1,color:C.dark,margin:"14px 0"}}>
Handcrafted Stories <span style={{color:C.coral,fontStyle:"italic"}}>for Beautiful</span> Homes
</h1>

<p style={{fontSize:mobile?14:16,lineHeight:1.7,color:"#6B5B4E",maxWidth:520}}>
Discover beautifully hand-molded pottery, planters, urns, décor accents, and gifting suites from master artisans.
</p>

<div style={{display:"flex",flexDirection:mobile?"column":"row",gap:10,marginTop:22}}>
<Link to="/products" style={{textDecoration:"none",textAlign:"center",padding:"14px 26px",borderRadius:999,background:C.coral,color:"#fff",fontWeight:700,boxShadow:`0 8px 20px ${C.coral}40`}}>Shop Collection <ArrowRight size={16} style={{display:"inline"}}/></Link>
<Link to="/about" style={{textDecoration:"none",textAlign:"center",padding:"14px 26px",borderRadius:999,border:"1px solid rgba(0,0,0,.2)",color:C.dark}}>Our Story</Link>
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:24,paddingTop:18,borderTop:"1px solid rgba(0,0,0,.12)"}}>
{stats.map(([n,l])=><div key={l}><div style={{fontFamily:"Playfair Display,serif",fontSize:mobile?22:28,fontWeight:700,color:C.dark}}>{n}</div><div style={{fontSize:mobile?11:12,color:"#7D7065"}}>{l}</div></div>)}
</div>
</div>

<div style={{flex:1,order:mobile?1:2,width:"100%"}}>
<div style={{position:"relative",maxWidth:560,margin:"0 auto"}}>
<img src={img("1609881583302-61548332039c",900,900)} alt="Hero" style={{width:"100%",height:mobile?300:600,objectFit:"cover",borderRadius:mobile?20:40,boxShadow:mobile?"0 12px 30px rgba(0,0,0,.08)":"none"}}/>

{/* Mobile-Enhanced Floating Cards */}
<div style={{position:"absolute",bottom:12,left:12,background:"rgba(255,255,255,.95)",backdropFilter:"blur(10px)",padding:"10px 14px",borderRadius:14,fontSize:12,boxShadow:"0 8px 20px rgba(0,0,0,.1)"}}>
<strong style={{color:C.dark}}>🏺 Terracotta Vase</strong><br/><span style={{color:C.coral,fontWeight:600,fontSize:11}}>Just Restocked</span>
</div>

<div style={{position:"absolute",top:12,right:12,background:C.green,color:"#fff",padding:"6px 12px",borderRadius:999,fontSize:11,fontWeight:700,boxShadow:"0 6px 15px rgba(0,0,0,.1)"}}>
🌿 100% Eco Friendly
</div>
</div>
</div>

</div>
</section>
);
}