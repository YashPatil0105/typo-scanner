// This is a sampple JavaScript file with intentional typoes

function calcluateSum(a, b) {
    return a + b;
  }
  
  const numbrs = [1, 2, 3, 4];
  let totl = 0;
  
  numbrs.forEach(numbr => {
    totl += numbr;
  });
  
  console.log("The total is:", totl);
  
  class Calcualtor {
    constructor() {
      this.reslt = 0;
    }
    addNummber(numbr) {
      this.reslt += numbr;
    }
    getReslt() {
      return this.reslt;
    }
  }
  
  const calc = new Calcualtor();
  calc.addNummber(5);
  calc.addNummber(10);
  console.log("Calculator result:", calc.getReslt());
  