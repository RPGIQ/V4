<script type="module">
  import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

  // مفتاح API الخاص بك
  const API_KEY = "AIzaSyBMcbv1i-Yr9Bji4wQPLvlsRdaR4oNWxHo";
  const genAI = new GoogleGenerativeAI(API_KEY);

  // تحديد النموذج المستخدم
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function solveEquation() {
    const equation = document.getElementById('equation-input').value.trim();

    // التحقق من أن المستخدم أدخل معادلة
    if (!equation) {
      document.getElementById('result').innerText = "Please enter a chemical equation.";
      return;
    }

    const prompt = `Solve this chemical equation: ${equation}`;

    try {
      const result = await model.generateContent(prompt);
      
      // التحقق من وجود استجابة صحيحة
      const text = result.response?.candidates?.[0]?.text;
      if (text) {
        document.getElementById('result').innerText = "Solution: " + text.trim();
      } else {
        document.getElementById('result').innerText = "Error: Unable to solve the equation. Please try again.";
      }

    } catch (error) {
      console.error('Error occurred while solving the equation:', error);
      
      // عرض رسالة الخطأ للمستخدم
      if (error.message.includes('API key expired')) {
        document.getElementById('result').innerText = "Error: Your API key has expired. Please renew it.";
      } else if (error.message.includes('API_KEY_INVALID')) {
        document.getElementById('result').innerText = "Error: Invalid API key. Please check your API key.";
      } else {
        document.getElementById('result').innerText = "Error: " + error.message;
      }
    }
  }

  // ربط الزر بوظيفة حل المعادلة
  document.getElementById('solve-button').onclick = solveEquation;
</script>
