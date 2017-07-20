/**
 * Por si no hay ya suficientes plugins de esto ...
 * Supongo que me va la marcha :)
 * @author Alejandro Orta Sanz (alejandro-orta.es)
 * ¿Licencia? ¿Eso que es?
 */
(function() {

var utils = {
  extend: function(out) {
    out = out || {}

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue
      }

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key]
        }
      }
    }

    return out
  },

  hasClass: function(el, className) {
    if (el.classList) {
      return el.classList.contains(className)
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
    }
  },

  addClass: function(el, className) {
    if(el.classList) {
      el.classList.add(className)
    } else {
      el.className += className
    }
  },

  removeClass: function(el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
  }
}

var s = function(select, userOpts) {
  var defaultsOpts = {
    itemTpl: false,
    itemTpl: false,
    submitBtn: true,
    placeholder: 'Select',
    maxPlaceholdersValues: 3,
    hiddenInputName: 'simpleMultiselectName'
  }

  var options = {}
  utils.extend(options, defaultsOpts, userOpts)

  // Get all default select options
  var selectOptions = []
  select.querySelectorAll('option').forEach(function(item) {
    selectOptions.push({
      name: item.textContent,
      value: item.getAttribute('value')
    })
  })

  // Create new Select HTML along with the new Hidden Input
  var newHtml = '<div class="simple-multiselect ' + select.getAttribute('id') + '">'
  newHtml += '<input type="hidden" name="' + options.hiddenInputName + '">'
  newHtml += '<div class="top-select"><span>' + options.placeholder + '</span></div>'

  newHtml += '<div class="simple-multiselect-items">'
  selectOptions.forEach(function(newOpt) {
    newHtml += '<div class="item-multiselect">'
    newHtml += '<input type="checkbox" data-name="' + newOpt.name +'" value="' + newOpt.value + '" name="item-' + newOpt.value + '">'
    if(options.itemTpl) {
      newHtml += '<label for="item-' + newOpt.value + '">' + options.itemTpl + '</label>'
    } else {
      newHtml += '<label for="item-' + newOpt.value + '"></label>'
    }
    newHtml += '</div>'
  })
  newHtml += '</div>'

  newHtml += '</div>'

  // Append new Select and hide old
  select.insertAdjacentHTML('afterend', newHtml)
  select.style.display = 'none'

  // Set hidden input
  var hiddenInput = document.getElementsByName(options.hiddenInputName)[0]

  // Bind events
  var newSelect = document.getElementsByClassName(select.getAttribute('id'))[0]
  newSelect.querySelectorAll('input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {
      updateHiddenInputValue()
      updateSelectPlaceholder()
    })
  })

  // Bind open select
  newSelect.querySelectorAll('.top-select span')[0].addEventListener('click', function(e) {
    if(utils.hasClass(newSelect, 'in')) {
      utils.removeClass(newSelect, 'in')
    } else {
      utils.addClass(newSelect, 'in')
    }
  })

  // Update Hidden input value
  function updateHiddenInputValue() {
    var values = new Array()
    newSelect.querySelectorAll('input:checked').forEach(function(item) {
      values.push(item.getAttribute('value'))
    })
    hiddenInput.value = values
  }

  // Udate placeholder
  function updateSelectPlaceholder() {
    var names = new Array()

    newSelect.querySelectorAll('input:checked').forEach(function(item) {
      names.push(item.getAttribute('data-name'))
    })

    var newPlaceholder = ''

    if(names.length > options.maxPlaceholdersValues) {
      newPlaceholder = names.length + ' opciones seleccionadas'
    } else {
      names.forEach(function(name, key) {
        newPlaceholder += name
        if(key < names.length -1) {
          newPlaceholder += ', '
        }
      })
    }

    if(!names.length) {
      newPlaceholder = options.placeholder
    }

    newSelect.querySelectorAll('.top-select span')[0].textContent = newPlaceholder
  }
}

if (typeof self !== 'undefined') {
	self.SimpleMultiselect = s
}

if (typeof module === 'object' && module.exports) {
	module.exports = s
}

return s

}())
