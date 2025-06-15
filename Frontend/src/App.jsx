
import { Route, Routes, useMatch } from 'react-router-dom'
import { Home } from './pages/student/Home'
import { CourseList } from './pages/student/CourseList'
import { CourseDetails } from './pages/student/CourseDetails'
import { MyEnrollments } from './pages/student/MyEnrollments'
import { Player } from './pages/student/Player'
import { Loading } from './components/student/Loading'
import { Educator } from './pages/Educator/Educator'
import { Dashboard } from './pages/Educator/Dashboard'
import { AddCourse } from './pages/Educator/AddCourse'
import { MyCourses } from './pages/Educator/MyCourses'
import { StudentsEnrolled } from './pages/Educator/StudentsEnrolled'
import { Navbar } from './components/student/Navbar'
import "quill/dist/quill.snow.css";
 import { ToastContainer } from 'react-toastify';

function App() {

  const isEducator = useMatch("/educator/*")

  return (
  <div className='text-default min-h-screen bg-white'>
    <ToastContainer />
   {!isEducator &&  <Navbar />}
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/course-list' element={<CourseList />} />
      <Route path='/course-list/:input' element={<CourseList />} />
      <Route path='/course/:id' element={<CourseDetails />} />
      <Route path='/my-enrollments' element={<MyEnrollments />} />
      <Route path='/player/:courseId' element={<Player />} />
      <Route path='/loading/:path' element={<Loading />} />
      <Route path='/educator' element={<Educator />} >
        <Route path='/educator' element={<Dashboard />} />
        <Route path='add-course' element={<AddCourse />} />
        <Route path='my-course' element={< MyCourses/>} />
        <Route path='student-enrolled' element={<StudentsEnrolled />} />
      </Route>
    </Routes>
  </div>
  )
}

export default App
