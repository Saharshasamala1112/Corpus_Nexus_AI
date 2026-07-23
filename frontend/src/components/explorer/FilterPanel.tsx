interface Props {

    languages:any[];

    categories:any[];

}


export default function FilterPanel({
    languages,
    categories
}:Props){


return (

<div>


<h2>
Languages
</h2>


<select>
  {languages.map((lang) => (
    <option key={lang.code} value={lang.code}>
      {lang.name}
    </option>
  ))}
</select>




<h2>
Categories
</h2>


<select>

{
categories.map((cat)=>(
<option key={cat.id}>
{cat.title}
</option>
))
}

</select>



</div>

)

}