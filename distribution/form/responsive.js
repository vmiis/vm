var _r=function(n){var f=n[0].contentRect.width,k=n[0].target.id,d=document.getElementById(k).getAttribute("bp"),u,s,h,c,l,t,w,a,v,y,p,b,o;if(d!=null)for(u=d.split("|"),s=1e7,u.length>0&&(s=parseInt(u[0])),h=2e7,u.length>1&&(h=parseInt(u[1])),c=3e7,u.length>2&&(c=parseInt(u[2])),l=4e7,u.length>3&&(l=parseInt(u[3])),t=document.getElementById(k).getElementsByTagName("div"),i=0;i<t.length;i++)if(w=t[i].getAttribute("w"),w!=null){t[i].style.float="left";t[i].style["box-sizing"]="border-box";t[i].parentElement.style["border-width"]=0;t[i].parentElement.style["box-sizing"]="border-box";t[i].parentElement.style.display="flow-root";var r=w.split("|"),e=parseFloat(getComputedStyle(t[i].parentElement,null).getPropertyValue("width").replace(".px","")),g=parseFloat(getComputedStyle(t[i].parentElement,null).getPropertyValue("padding-left").replace(".px",""))+parseFloat(getComputedStyle(t[i].parentElement,null).getPropertyValue("padding-right").replace(".px",""))+parseFloat(getComputedStyle(t[i].parentElement,null).getPropertyValue("border-left-width").replace(".px",""))+parseFloat(getComputedStyle(t[i].parentElement,null).getPropertyValue("border-right-width").replace(".px",""));e=e-g;a=576;r.length>0&&(a=e*r[0]/100);v=a;r.length>1&&(v=e*r[1]/100);y=v;r.length>2&&(y=e*r[2]/100);p=y;r.length>3&&(p=e*r[3]/100);b=p;r.length>4&&(b=e*r[4]/100);o=0;f<s&&(o=a);f>=s&&f<h&&(o=v);f>=h&&f<c&&(o=y);f>=c&&f<l&&(o=p);f>=l&&(o=b);t[i].style.width=o+"px"}};new ResizeObserver(_r).observe(form_container__ID)