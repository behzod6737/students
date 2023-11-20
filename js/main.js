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

const elForm = getElement('.filter')
const elInputName = getElement('.input__name')
const elAddForm = getElement('.add-form')
const elInputAddName = getElement('.add-input__name')
const elInputAddLastName = getElement('.add-input__lastname')
const elInputAddMark = getElement('.add-input__mark')
const elTableBody = getElement('#students-table-body')
const elTemlate = getElement('#student-template').content
let elCount = getElement('.count')



// ! rendering students table
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

// ! filtering students
const filterSearch = (e) => {
	e.preventDefault()
	if (elInputName.value === '') {
		return renderTableStudent(students, elTableBody)
	}
	renderTableStudent(students.filter(student => elInputName.value.toLowerCase().trim().includes(student.name.toLowerCase() && student.lastName.toLowerCase() )),elTableBody)
	e.target.reset()
}
// ! add new student 
const addNewStudent = (e) =>{
	
	e.preventDefault()
	if(elInputAddName.value.trim() && elInputAddLastName.value.trim() &&  elInputAddMark.value.trim()) {
		students.push({
			id: students[4].id + 1 ,
			name: elInputAddName.value,
			lastName: elInputAddLastName.value,
			mark: elInputAddMark.value,
			markedDate: new Date().toISOString()
		})
		renderTableStudent(students, elTableBody)
	}
	
	
}


elAddForm.addEventListener('submit', addNewStudent)
elForm.addEventListener('submit', filterSearch)