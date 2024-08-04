const { Router } = require("express");
const Debtor = require('../models/debtor');

const router = Router();


router.get('/signup' , (req , res) => {
    return res.render('signup')
})

router.get('/signin' , (req , res) => {
    return res.render('signin')
})

router.get('/debtorHome' , async(req , res) => {
    try {
        // Fetch debtor data, e.g., total number of debtors
        const totalDebtors = await Debtor.countDocuments(); // Or any other query based on your needs
        
        // Render the view and pass the debtor data
        return res.render('debtorHome', {
          totalDebtors,
        });
      } catch (error) {
        console.error('Error fetching debtor data:', error);
        return res.status(500).send('Error fetching debtor data');
      }
    });


router.get('/allinvestors' , (req , res) => {
    return res.render('allinvestors')
})

router.get('/debtorProfile' , (req , res) => {
    return res.render('debtorProfile')
})



router.post('/signup' , async(req , res) => {
    const { fullName , email , password } = req.body;

    try{ 
        await Debtor.create({
            fullName,
            email,
            password,
        });
        return res.redirect('debtorHome');

    }catch(error){
        return res.render("signup" , {
            error : "Email Already Exist!"
        })
    }
    
})



router.post('/signin' , async(req , res) => {
     const { email , password } = req.body;

     try{
        
         const token = await Debtor.matchPasswordAndGenerateToken({ email, password });

         return res.cookie('token' , token).redirect('debtorHome');
        
        }catch (error){
            console.error("Error in /signin:", error);
            return res.render("signin" , {
                error : "Incorrect Email or Password" ,
        })

    }

    })


    router.get('/debtorProfile', async (req, res) => {
        try {
            const { email } = req.debtor; // Assuming email is in req.debtor
            const debtor = await Debtor.findOne({ email });
    
            if (!debtor) {
                return res.status(404).send('User not found');
            }
    
            return res.render('profile', {
                debtor,
            });
        } catch (error) {
            console.error('Error fetching debtor profile:', error);
            return res.status(500).send('Error fetching debtor profile');
        }
    });
    

   

router.get('/logout' ,(req , res) => {
    res.clearCookie('token')
    .redirect('/');
})



module.exports = router;