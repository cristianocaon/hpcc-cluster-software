import React, { useState, useEffect } from 'react'
import StackItem from "./StackItem";
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
    flexDirection: 'column',
    textAlign: 'center',
    marginTop: '10px',
  },
  button: {
    margin: '10px',
    marginLeft: '8px',
    marginRight: '8px',
  },
  paper: {
    padding: '1rem',
  },
}));

function StackList({ data }) {
  const classes = useStyles();

  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [prevLength, setPrevLength] = useState(0);

  const handleClick = (event, id, setFlag) => {
    let curr = event.target.innerText.toLowerCase();
    if (level === id) {
      let lastSelected = selected[selected.length - 1];
      if (level % 2 === 0) {
        if (selected.length === 0) {
          let temp = [...selected, data[curr].versions];
          setSelected(temp);
          setPrevLength(temp.length)
        } else {
          let temp = [...selected, lastSelected[curr].versions]
          setSelected(temp);
          setPrevLength(temp.length)
        }
      } else {
        let temp = [...selected, lastSelected[curr].child]
        setSelected(temp);
        setPrevLength(temp.length)
      }
      setLevel(level + 1);
    } else {
      let temp = selected.slice(0, id);
      let lastSelected = temp.length === 0 ? [] : temp[temp.length - 1];
      if (id % 2 === 0) {
        if (lastSelected.length === 0) {
          setSelected([...temp, data[curr].versions]);
        } else {
          setSelected([...temp, lastSelected[curr].versions]);
        }
      } else {
        setSelected([...temp, lastSelected[curr].child]);
      }
      setLevel(id + 1);
    }
    setFlag(true);
  }

  useEffect(() => {
    let fields = []
    let lastSelected = selected[selected.length - 1];
    console.log(lastSelected)
    if (level % 2 !== 0) {
      Object.keys(lastSelected).map(key => {
        let path = lastSelected[key].path;
        let module = lastSelected[key].module_name;
        let info = "module: " + module + " path: " + path;
        fields.push([key, info, level + 1]);
      })
    } else {
      if (selected.length !== 0)
        Object.keys(lastSelected).map(key => {
          let info = lastSelected[key].info;
          fields.push([key, info, level + 1]);
        })
    }
    if (selected.length === prevLength) {
      setCards([...cards, fields]);
    } else {
      let temp = cards.slice(0, selected.length);
      setCards([...temp, fields]);
    }
  }, [selected, level, prevLength])

  useEffect(() => {
    let fields = []
    Object.keys(data).map(key => {
      let info = data[key].info;
      fields.push([key, info, level]);
    })
    setCards([fields]);
  }, [data])

  // console.log(data)
  // console.log(cards)
  // console.log(selected)

  if (cards) {
    return (
      cards.map(card => (
        <Card key={card[0]} className={classes.card}>
          {card.map(field => {
            return <StackItem data={field[0]} info={field[1]} level={level} onClick={handleClick} />
          })}
        </Card>
      ))
    )
  } else return null;
}

export default StackList