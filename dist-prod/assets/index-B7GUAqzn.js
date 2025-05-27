import{_ as z}from"./Dialog.vue_vue_type_style_index_0_lang-ncKgepny.js";import{d as L,h as U,z as V,r as i,n as A,al as K,U as $,o as C,c as O,f as n,w as t,g as f,u as s,x as g,t as W,y as X,a3 as G,k as H,F as P,dX as Q,dY as Y,cl as q,I as Z,ap as ee}from"./index-DPENBzsb.js";import{_ as ae}from"./ContentWrap.vue_vue_type_script_setup_true_lang-CnIlr_-B.js";import{u as ne}from"./useFormCreateDesigner-BoVUdKh0.js";import{H as v,j as te}from"./java-B396Iwf_.js";import"./index-BCN8BzfC.js";import"./dict.type-UYIEcT9p.js";function se(r){const o=["true","false","null"],c={scope:"literal",beginKeywords:o.join(" ")};return{name:"JSON",aliases:["jsonc"],keywords:{literal:o},contains:[{className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},{match:/[{}[\],:]/,className:"punctuation",relevance:0},r.QUOTE_STRING_MODE,c,r.C_NUMBER_MODE,r.C_LINE_COMMENT_MODE,r.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}const oe={class:"h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"},le={key:0,ref:"editor"},ie={class:"hljs"},re=L({name:"InfraBuild",__name:"index",setup(r){const{t:o}=U(),c=V(),w=i({switchType:[],autoActive:!0,useTemplate:!1,formOptions:{form:{labelWidth:"100px"}},fieldReadonly:!1,hiddenDragMenu:!1,hiddenDragBtn:!1,hiddenMenu:[],hiddenItem:[],hiddenItemConfig:{},disabledItemConfig:{},showSaveBtn:!1,showConfig:!0,showBaseForm:!0,showControl:!0,showPropsForm:!0,showEventForm:!0,showValidateForm:!0,showFormConfig:!0,showInputData:!0,showDevice:!0,appendConfigData:[]}),l=i(),u=i(!1),y=i(""),m=i(-1),p=i("");ne(l);const h=a=>{u.value=!0,y.value=a},N=()=>{h("\u751F\u6210 JSON"),m.value=0,p.value=l.value.getRule()},S=()=>{h("\u751F\u6210 Options"),m.value=1,p.value=l.value.getOption()},E=()=>{h("\u751F\u6210\u7EC4\u4EF6"),m.value=2,p.value=M()},M=()=>{const a=l.value.getRule(),e=l.value.getOption();return`<template>
    <form-create
      v-model:api="fApi"
      :rule="rule"
      :option="option"
      @submit="onSubmit"
    ></form-create>
  </template>
  <script setup lang=ts>
    const faps = ref(null)
    const rule = ref('')
    const option = ref('')
    const init = () => {
      rule.value = formCreate.parseJson('${Q.toJson(a).replaceAll("\\","\\\\")}')
      option.value = formCreate.parseJson('${JSON.stringify(e)}')
    }
    const onSubmit = (formData) => {
      //todo \u63D0\u4EA4\u8868\u5355
    }
    init()
  <\/script>`},b=a=>{let e="json";return m.value===2&&(e="xml"),q(a)||(a=JSON.stringify(a,null,2)),v.highlight(a,{language:e,ignoreIllegals:!0}).value||"&nbsp;"};return A(async()=>{v.registerLanguage("xml",te),v.registerLanguage("json",se)}),(a,e)=>{const d=Z,D=K("fc-designer"),k=ae,x=ee,I=z,J=$("dompurify-html");return C(),O(P,null,[n(k,{"body-style":{padding:"0px"},class:"!mb-0"},{default:t(()=>[f("div",oe,[n(D,{class:"my-designer",ref_key:"designer",ref:l,config:s(w)},{handle:t(()=>[n(d,{size:"small",type:"primary",plain:"",onClick:N},{default:t(()=>e[2]||(e[2]=[g("\u751F\u6210JSON")])),_:1}),n(d,{size:"small",type:"success",plain:"",onClick:S},{default:t(()=>e[3]||(e[3]=[g("\u751F\u6210Options")])),_:1}),n(d,{size:"small",type:"danger",plain:"",onClick:E},{default:t(()=>e[4]||(e[4]=[g("\u751F\u6210\u7EC4\u4EF6")])),_:1})]),_:1},8,["config"])])]),_:1}),n(I,{modelValue:s(u),"onUpdate:modelValue":e[1]||(e[1]=_=>H(u)?u.value=_:null),title:s(y),"max-height":"600"},{default:t(()=>[s(u)?(C(),O("div",le,[n(d,{style:{float:"right"},onClick:e[0]||(e[0]=_=>(async j=>{const B=JSON.stringify(j,null,2),{copy:F,copied:T,isSupported:R}=Y({source:B});R?(await F(),s(T)&&c.success(o("common.copySuccess"))):c.error(o("common.copyError"))})(s(p)))},{default:t(()=>[g(W(s(o)("common.copy")),1)]),_:1}),n(x,{height:"580"},{default:t(()=>[f("div",null,[f("pre",null,[X(f("code",ie,null,512),[[J,b(s(p))]])])])]),_:1})],512)):G("",!0)]),_:1},8,["modelValue","title"])],64)}}});export{re as default};
