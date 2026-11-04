const assert=require('node:assert/strict');const M=require('../lab-math.js');
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// FK/IK round trips, singular and unreachable targets.
for(const q1 of [-130,-30,0,45,110])for(const q2 of [-140,-65,20,90,170]){const f=M.robotFK(250,180,q1,q2),k=M.robotIK(250,180,f.x,f.y,Math.sign(q2));assert.ok(k.reachable);const back=M.robotFK(250,180,k.q1,k.q2);near(back.x,f.x);near(back.y,f.y);}
assert.equal(M.robotIK(250,180,500,0).reachable,false);assert.equal(M.robotIK(250,180,0,0).reachable,false);assert.equal(M.robotFK(250,180,0,0).singular,true);
// Simply supported central point load: M=FL/4, delta=FL^3/(48EI).
let b=M.beam({length:4,load:10,position:50,E:210,I:800,type:'point'});near(b.RA,5);near(b.RB,5);near(b.maxM,10);near(b.maxDeflection,10000*4000**3/(48*210000*800*10000));near(b.at(0).y,0);near(b.at(4).y,0);
// Asymmetric reactions, continuity of displacement and bending moment.
b=M.beam({length:5,load:12,position:30,E:200,I:1200,type:'point'});near(b.RA+b.RB,12);near(b.RB*5,12*1.5);near(b.at(1.5-1e-9).M,b.at(1.5+1e-9).M);near(b.at(1.5-1e-9).y,b.at(1.5+1e-9).y);
b=M.beam({length:4,load:2,position:50,E:210,I:800,type:'uniform'});near(b.RA,4);near(b.maxM,4);near(b.maxDeflection,5*2*4000**4/(384*210000*800*10000));
// DC benchmark, power balance and parallel branch current law.
let c=M.circuit({U:12,R1:100,R2:200,connection:'series'});near(c.I,.04);near(c.V1,4);near(c.V2,8);near(c.P1,.16);near(c.P2,.32);near(c.balance,0);
c=M.circuit({U:12,R1:100,R2:200,connection:'parallel'});near(c.I,.18);near(c.I1+c.I2,c.I);near(c.balance,0);
// Limits are explicit user input, not an ISO fit lookup.
for(const [slo,shi,kind] of [[-20,-5,'С хлабина'],[10,30,'Преходна'],[35,50,'Със стегнатост']]){const f=M.fit({nominal:40,hlo:0,hhi:25,slo,shi});assert.equal(f.kind,kind);near((f.hmin-f.smax)*1000,f.min);}
assert.throws(()=>M.fit({nominal:40,hlo:30,hhi:20,slo:0,shi:10}));assert.throws(()=>M.circuit({U:12,R1:0,R2:200}));assert.throws(()=>M.beam({length:0,load:10,position:50,E:210,I:800}));
console.log('PASS: robot kinematics, beam equilibrium/deflection, circuit KCL/power, fit limits and invalid inputs');
