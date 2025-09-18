import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const meta=()=>(
    [{title:"Resume Analyser | auth"},
     {name:"description" ,content:"log into your account"}
    ]
)

export default 
[   index("routes/home.tsx"),
    route("/auth","routes/auth.tsx"),
    route('/upload','routes/upload.tsx'),
    route('resume/:id','routes/resume.tsx')
] satisfies RouteConfig;
