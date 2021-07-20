'use strict'

document.addEventListener('DOMContentLoaded', e => {
   try {
      let textareaElements = document.querySelectorAll(".translator__input-field")
      textareaElements.forEach(textareaElement => {
         textareaElement.addEventListener('input', autoResize, false)
      })

      function autoResize() {
         this.style.height = 'auto';
         this.style.height = this.scrollHeight + 'px'
      }

      const fromLanguageItems = document.querySelectorAll("[data-from-language-item]"),
         toLanguageItems = document.querySelectorAll("[data-to-language-item]"),
         fromLanguageField = document.querySelector("#from-language-field"),
         toLanguageField = document.querySelector("#to-language-field"),
         letterCount = document.getElementById('letter-count')

      let fromLanguageIndex = 0,
         toLanguageIndex = 1

      function start() {
         if (localStorage.getItem('fromLanguageIndex') !== null) {
            fromLanguageIndex = localStorage.getItem('fromLanguageIndex')
         }

         if (localStorage.getItem('toLanguageIndex') !== null) {
            toLanguageIndex = localStorage.getItem('toLanguageIndex')
         }

         fromLanguageItems[fromLanguageIndex].classList.add('languages__item--active')
         toLanguageItems[toLanguageIndex].classList.add('languages__item--active')
      }

      start()

      function setLanguage(languageItems, languageType) {
         languageItems.forEach((languageItem, index) => {
            languageItem.addEventListener('click', async e => {
               languageItems.forEach(languageItem => languageItem.classList.remove('languages__item--active'))
               localStorage.setItem(languageType, index)
               start()
               await renderTranslate()
            })
         })
      }

      setLanguage(fromLanguageItems, 'fromLanguageIndex')
      setLanguage(toLanguageItems, 'toLanguageIndex')

      async function fetchTranslatingWords(fromLanguageIndex, toLanguageIndex, text) {
         let response = await fetch('http://localhost:3000/translate', {
            headers: {
               'Content-Type': 'application/json; charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify({
               fromLanguage: ['uz', 'en', 'ru'][fromLanguageIndex],
               toLanguage: ['uz', 'en', 'ru'][toLanguageIndex],
               text: text
            })
         })

         return await response.json()
      }

      async function renderTranslate() {
         let result = await fetchTranslatingWords(fromLanguageIndex, toLanguageIndex, fromLanguageField.value.trim())
         toLanguageField.value = result.text
      }

      fromLanguageField.addEventListener('input', async e => {
         letterCount.textContent = fromLanguageField.value.length
         await renderTranslate()
      })
   } catch (e) {
      console.error(e)
   }
})