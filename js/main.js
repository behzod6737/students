const getElement = (element, parentElement = document) => parentElement.querySelector(element)

const fixDate = (date) =>{
	const newDate = new Date(date)
	let releaseDate = ''
	releaseDate += String( newDate.getDate()).padStart(2,'0')
	releaseDate +=`-${ String( newDate.getMonth()+1).padStart(2,'0')}-`
	releaseDate +=  newDate.getFullYear()
	return releaseDate
  }

const TOTAL_MARK = 150
const MARK_PERCENT = 100
const FAIL_PERCENT = 40

const elTableBody = getElement('#students-table-body')
const elTemlate = getElement('#student-template').content
let elCount = getElement('.count')




const renderTableStudent = (students, goingElement ) =>{
	goingElement.innerHTML =  null
	const fragment  = document.createDocumentFragment()

	elCount.textContent = `count: ${students.length}` 
	
	students.forEach(student => {
		const template = elTemlate.cloneNode(true)
		const {id,name,lastName,mark,markedDate} = student

		getElement('.student__table-row',template).id = id
		getElement('.student-id',template).id = id
		getElement('.student-id',template).textContent = id
		getElement('.student-name',template).textContent = `${name} ${lastName}`
		getElement('.student-marked-date',template).textContent = fixDate(markedDate)
		let markTotalPercent = Math.round((mark * MARK_PERCENT) / TOTAL_MARK)

		// shunaqa yo'l bilan chaqirib osayam boladi dom nodani 
		template.querySelector('.student-mark').textContent = markTotalPercent + '%';

		if (markTotalPercent <= FAIL_PERCENT) {
			template.querySelector('.student-pass-status').classList.add('bg-danger')
			template.querySelector('.student-pass-status').textContent = 'fail'
		}  else{
			getElement('.student-pass-status',template).classList.add('bg-success')
			getElement('.student-pass-status',template).textContent = 'pass'
		}
		fragment.append(template)
	})
	goingElement.append(fragment)
}

renderTableStudent(students, elTableBody)