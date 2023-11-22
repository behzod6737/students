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
const elinputFrom = getElement('.filter-form__from')
const elinputto = getElement('.filter-form__to')
const elInputFilterSort = getElement('#sortby')


const elAddForm = getElement('.add-form')
const elInputAddName = getElement('.add-input__name')
const elInputAddLastName = getElement('.add-input__lastname')
const elInputAddMark = getElement('.add-input__mark')


const elInputEditForm = getElement('.edit__form')
const elInputEditName = getElement('#edit-name')
const elInputEditLastName = getElement('#edit-lastname')
const elInputEditMark = getElement('#edit-mark')

const elTableBody = getElement('#students-table-body')
const elTemlate = getElement('#student-template').content
const  elCount = getElement('.count')
let elAvarageMark = getElement('.avarage-mark')




// ! rendering students table
const renderTableStudent = (students, goingElement ) =>{
	goingElement.innerHTML =  null
	const fragment  = document.createDocumentFragment()

	elCount.textContent = `count: ${students.length}` 

	students.forEach(student => {
		const template = elTemlate.cloneNode(true)
		const {id,name,lastName,mark,markedDate} = student

		getElement('.student__table-row',template).setAttribute('data-id', id) 
		getElement('.student-id',template).id = id
		getElement('.student-id',template).textContent = id
		getElement('.student-name',template).textContent = `${name} ${lastName}`
		getElement('.student-marked-date',template).textContent = fixDate(markedDate)
		let markTotalPercent = Math.round((mark * MARK_PERCENT) / TOTAL_MARK)
		elAvarageMark.textContent = `Average mark:65%`
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

// ! filtering students yemagan versiya
// const filterSearch = (e) => {

// 	const searchingValue = new RegExp(e.target.value, 'gi')

// 	if (searchingValue === '') {
// 		return renderTableStudent(students, elTableBody)
// 	}

// 	renderTableStudent(students.filter(student => `${student.name} ${student.lastName}`.match(searchingValue) ),elTableBody)
// }


// ! add new student 
const addNewStudent = (e) =>{
	e.preventDefault()
	
	if(elInputAddName.value.trim() && elInputAddLastName.value.trim() &&  elInputAddMark.value.trim()) {
		students.push({
			id: students[students.length -1].id + 1 ,
			name: elInputAddName.value,
			lastName: elInputAddLastName.value,
			mark: elInputAddMark.value,
			markedDate: new Date().toISOString()
		})
		renderTableStudent(students, elTableBody)
		e.target.reset()
		alert('new student is added')		
	}
	
	
}

// ! delete and  edit  buttons 

const onTableClick = (event) =>{
	
	if (event.target.matches('.student-delete')) {
		let currentRowId = event.target.closest('.student__table-row').dataset.id
		// const currentStudentIndex = students.findIndex(student =>  student.id === +currentRowId)

		students = students.filter( student =>  student.id !== +currentRowId )
		renderTableStudent(students,elTableBody)

	}else if (event.target.matches('.student-edit')) {
		const currentRowId = event.target.closest('.student__table-row').dataset.id
		
		const currentStudentIndex = students.findIndex(student => student.id === +currentRowId)

		const {name, lastName, mark,id,markedDate} = students[currentStudentIndex]


		elInputEditName.value = name
		elInputEditLastName.value = lastName
		elInputEditMark.value = mark

		elInputEditForm.addEventListener('submit', (event) => {
			event.preventDefault()
			
			if (elInputEditName.value.trim() && elInputEditLastName.value.trim() && +elInputEditMark.value.trim() && +elInputEditMark.value >= 0 && +elInputEditMark.value  <= 150 ) {
				
				const editedStudent = {
					id,
					markedDate,
					name: elInputEditName.value,
					lastName: elInputEditLastName.value,
					mark : elInputEditMark.value
				}
				students.splice(currentStudentIndex,1,editedStudent)
			}

			renderTableStudent(students, elTableBody)
		})

		// renderTableStudent(students, elTableBody)
	}
}

if (elTableBody) {
	elTableBody.addEventListener('click' , onTableClick)
}

elAddForm.addEventListener('submit', addNewStudent)

// ! filtering students  new version
elForm.addEventListener('submit' , (e) => {
	e.preventDefault()

	let newStudent = [...students].sort((a,b) => {
		switch (elInputFilterSort.value) {
			case '1':
				if(a.name < b.name ) return -1
				else if( a.name > b.name ) return 1
				else return 0
			case '2':
				return a.mark -b.mark
			case '3':
				return b.mark -a.mark	
			case '4':
				return new Date(a.markedDate).getDate() - new Date(b.markedDate).getDate()	
		}
	})

	renderTableStudent(newStudent.filter(student => {
		const inputPercent = Math.round((student.mark * MARK_PERCENT) / TOTAL_MARK)
		
		if (`${student.name} ${student.lastName}`.includes(elInputName.value) && (elinputFrom.value ? elinputFrom.value : 0) <= inputPercent  && (elinputto.value ? elinputto.value : 100 ) >= inputPercent) {
			return student
		} 
	}),elTableBody)
})
