import React, { useEffect, useState } from "react";
import { C, img } from "../../../constants/theme";

const timeline = [
  { year:"2009", title:"Founded in Jaipur", desc:"Started with 3 artisans and one kiln" },
  { year:"2014", title:"Traditional Clay Selection", desc:"Partnered with natural mineral clay mines in Rajasthan" },
  { year:"2019", title:"Kiln-Fired Durability", desc:"Introduced high-temperature firing for lasting beauty" },
  { year:"2024", title:"Artisan Heritage Network", desc:"Now empowering 200+ artisans across India" },
];

export default function Craftsmanship(){
  const [mobile,setMobile]=useState(false);

  useEffect(()=>{
    const update=()=>setMobile(window.innerWidth<992);
    update();
    window.addEventListener("resize",update);
    return ()=>window.removeEventListener("resize",update);
  },[]);

  return(
    <section style={{padding:mobile?"70px 18px":"100px 40px",background:C.cream}}>
      <div style={{
        maxWidth:1280,
        margin:"0 auto",
        display:"grid",
        gridTemplateColumns:mobile?"1fr":"1fr 1fr",
        gap:mobile?50:80,
        alignItems:"center"
      }}>
        <div style={{position:"relative"}}>
          <div style={{
            position:"absolute",
            inset:mobile?8:-20,
            borderRadius:"50% 40% 50% 40% / 40% 50% 40% 50%",
            background:`linear-gradient(135deg,${C.blush}55,${C.coral}20)`
          }}/>
          <div style={{
            position:"relative",
            overflow:"hidden",
            borderRadius:mobile?24:"32px 32px 80px 32px",
            boxShadow:"0 24px 60px rgba(28,18,8,.18)"
          }}>
            <img
              src={img("1493106641515-6b5631de4bb9",700,700)}
              alt="Craftsmanship"
              style={{
                width:"100%",
                height:mobile?420:520,
                objectFit:"cover",
                display:"block"
              }}
            />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 60%,rgba(28,18,8,.55))"}}/>
            <div style={{
              position:"absolute",
              left:20,right:20,bottom:20,
              background:"rgba(255,255,255,.12)",
              backdropFilter:"blur(14px)",
              borderRadius:16,
              padding:"14px 18px",
              color:"#fff"
            }}>
              <div style={{fontFamily:"Playfair Display, serif",fontStyle:"italic"}}>
                "Clay remembers the hand that holds it."
              </div>
              <div style={{fontSize:12,opacity:.8,marginTop:6}}>— Earthen Echoes Artisan Team</div>
            </div>
          </div>

          <div style={{
            position:"absolute",
            top:mobile?20:40,
            right:mobile?16:-30,
            background:"#fff",
            borderRadius:18,
            padding:"16px 18px",
            boxShadow:"0 12px 30px rgba(0,0,0,.12)"
          }}>
            <div style={{fontSize:28,fontWeight:700,color:C.coral}}>15+</div>
            <div style={{fontSize:12,color:"#8A7A6E"}}>Years of Craft</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:28}}>
          <div>
            <span style={{fontSize:12,fontWeight:700,letterSpacing:2,color:C.teal}}>OUR STORY</span>
            <h2 style={{
              fontFamily:"Playfair Display, serif",
              fontSize:mobile?32:"clamp(32px,3vw,44px)",
              lineHeight:1.2,
              margin:"12px 0 16px",
              color:C.dark
            }}>
              Sustaining the Ancient Art of Clay Moulding
            </h2>
            <p style={{lineHeight:1.9,color:"#6B5B4E"}}>
              For generations, the potters of Jaipur have listened to the whispers of the earth. We preserve these traditions while creating timeless handcrafted décor.
            </p>
          </div>

          <div>
            {timeline.map((item,i)=>(
              <div key={item.year} style={{display:"flex",gap:18}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:C.coral}}/>
                  {i<timeline.length-1&&<div style={{width:2,flex:1,background:C.coral+"30"}}/>}
                </div>
                <div style={{paddingBottom:i<timeline.length-1?24:0}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.coral,background:C.coral+"15",padding:"3px 8px",borderRadius:30}}>
                      {item.year}
                    </span>
                    <strong>{item.title}</strong>
                  </div>
                  <p style={{margin:"8px 0 0",color:"#8A7A6E",lineHeight:1.7}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            style={{
              width:"fit-content",
              border:"none",
              cursor:"pointer",
              background:C.teal,
              color:"#fff",
              padding:"14px 28px",
              borderRadius:999,
              fontWeight:600,
              transition:".3s"
            }}
          >
            Meet Our Artisans →
          </button>
        </div>
      </div>
    </section>
  );
}
