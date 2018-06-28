$(document).ready(function(){
	function coldate(item)
	{
		var now = new Date();
		var ndate = new Date(now.toISOString().slice(0,10));
		var ddate = new Date(item.html().slice(10,20));
		if(ndate < ddate)
		{
			item.css('color', 'rgb(80,190,80)');
		}
		else if(ndate > ddate)
		{
			item.css('color', 'rgb(190,80,80)');
		}
		else
		{
			item.css('color', 'rgb(80,80,190)');			
		}
	}
	function save(item)
	{
		var todo = item.find('.tcont').val();
		var ddate = item.find('.date').val();
		var now = new Date();
		var mdate = now.toISOString().slice(0,10);
		$.post("save.php",{content: todo, c_date: mdate, d_date: ddate},
		function(data, status)
		{
			if((status == 'success')&&data)
			{
				data = JSON.parse(data);
				item.html(data.todo);
				$ids.push(data.id);
		        $('.del').click(function(e){
                    e.stopPropagation();			
		            del($(this).parent().parent()); 
			        });	
			    $('.tick').click(function(e){
                    e.stopPropagation();			
		            mark($(this).parent().parent()); 
	                });	
				coldate(item.find('.ddate'));
			}
			else
			{
				alert("Error: Failed to save changes!");
			}
		});
	}
	function modify(item)
	{
		var todo = item.find('.tcont').val();
		var ddate = item.find('.date').val();
		var now = new Date();
		var mdate = now.toISOString().slice(0,10);
		var index = $('.todo').index(item);	
		$.post("modify.php",{content: todo, c_date: mdate, d_date: ddate, todo_id: ids[index]},
		function(data, status)
		{
			if((status == 'success')&&data)
			{
				data = JSON.parse(data);
				item.html(data.todo);
		        $('.del').click(function(e){
                    e.stopPropagation();			
		            del($(this).parent().parent()); 
			        });	
				$('.tick').click(function(e){
                    e.stopPropagation();			
		            mark($(this).parent().parent()); 
	                });	
			coldate(item.find('.ddate'));	
			}
			else
			{
				alert("Error: Failed to save changes!");
			}
		});
	}
	function del(item)
	{
		var index = $('.todo').index(item);	
		$.post("delete.php",{todo_id: ids[index]},
		function(data, status)
		{
			if((status == 'success')&&data)
			{
				item.remove();
				ids.splice(index,1);
			}
			else
			{
				alert("Error: Failed to save changes!");
			}
		});
	}
	function mark(item)
	{
		var index = $('.todo').index(item);	
		if(!marked[index])
		{
			$.post("done.php",{todo_id: ids[index], done: 1},
			function(data, status)
			{
				if((status == 'success')&&data)
				{
					item.find('.work').css("textDecoration", "line-through");
					item.find('.tick').css("background-image", "url(tick.png)");
					marked[index] = true;
					item.find('.ddate').css("color", "rgb(120,120,80)");
				}
				else
				{
					alert("Error: Failed to save changes!");
				}
			});
		}
        else
		{
			$.post("done.php",{todo_id: ids[index], done: 0},
			function(data, status)
			{
				if((status == 'success')&&data)
				{
					item.find('.work').css("textDecoration", "none");
					item.find('.tick').css("background-image", "none");
					marked[index] = false;
					coldate(item.find('.ddate'));
				}
				else
				{
					alert("Error: Failed to save changes!");
				}
			});
		}
	}
	function add()
	{
		$("#add").unbind('click');
		$('.todo').unbind('click');
		var prev = $("#content").html();
		var now = new Date();
		var mindate = now.toISOString().slice(0,10);
		var maxdate = (Number(mindate.slice(0,4))+1)+mindate.slice(4,10);
		$("#content").html(prev+'<div class="todo"><form><textarea class="tcont" wrap="hard" required></textarea>'+
		'<br /><input type="date" class="date" min="'+mindate+'" max="'+maxdate+'" required />'+
		'<button class="save" type="submit">save</button><button class="cancel" type="button">cancel</button></form></div>');
		$('.todo:last').find(".cancel").click(function(e){ 
		    e.stopPropagation();
		    $('.todo:last').remove();
			$("#add").click(function(){ add(); });
			$('.todo').click(function(){ edit($(this)); });
			});
		$('.todo:last').find("form").submit(function(e){ 
            e.stopPropagation();
		    save($('.todo:last'));
			$("#add").click(function(){ add(); });
			$('.todo').click(function(){ edit($(this)); });
			});		
	}	
	function edit(item)
	{
		$("#add").unbind('click');
		$('.todo').unbind('click');
		var old = item.html();
		var todo = item.find('.work').text();
		var ddate = item.find('.ddate').text().slice(10,20);
		var now = new Date();
		var mindate = now.toISOString().slice(0,10);
		var maxdate = (Number(mindate.slice(0,4))+1)+mindate.slice(4,10);
		item.html('<form><textarea class="tcont" wrap="hard" required></textarea><br /><input type="date" class="date" min="'+
		mindate+'" max="'+maxdate+
		'" required />'+'<button class="save" type="submit">save</button><button class="cancel">cancel</button></form>');
		item.find('.tcont').val(todo);
		item.find('.date').val(ddate);
		item.find('.cancel').click(function(e){ 
		    e.stopPropagation();
		    item.html(old);
			$('.del').click(function(e){
                e.stopPropagation();			
		        del($(this).parent().parent()); 
			});	
			$('.tick').click(function(e){
                e.stopPropagation();			
		        mark($(this).parent().parent()); 
	        });
		    $("#add").click(function(){ add(); });
			$('.todo').click(function(){ edit($(this)); });
			});
		item.find("form").submit(function(e){ 
		    e.stopPropagation();
		    modify(item);
			$("#add").click(function(){ add(); });
			$('.todo').click(function(){ edit($(this)); });
			});	
	}
	$("#dd").click(function(){ $("#dBar").toggle(); });
	$("#add").click(function(){ add(); });
	$('.todo').click(function(){ edit($(this)); });
	$('.todo').each(function(index)
	{
		if(marked[index])
		{
			$(this).find('.work').css("textDecoration", "line-through");
			$(this).find('.tick').css("background-image", "url(tick.png)");
		}
	});
	$('.del').click(function(e){
        e.stopPropagation();			
		del($(this).parent().parent()); 
	});	
	$('.tick').click(function(e){
        e.stopPropagation();			
		mark($(this).parent().parent()); 
	});	
	$('.ddate').each(function(index)
	{
		if(marked[index])
		{
			$(this).css("color", "rgb(120,120,80)");
		}
		else
		{
			coldate($(this));
		}
	});
});